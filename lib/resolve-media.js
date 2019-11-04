/**
 * TODO: img not contained in link, so find closest tag which we could
 * possibly use as a label to describe the image...
 *
 * TODO: fallback to google cloud vision image description.
 */

'use strict'

const pMap = require('p-map')
const pRetry = require('p-retry')
const requestImageSize = require('request-image-size')

const resolveEmbeddedMedia = require('./resolve-embedded-media')
const resolveExternalMedia = require('./resolve-external-media')

const uniqueBy = require('./unique-by')

module.exports = async ($, opts) => {
  const {
    concurrency = 8,
    minImageWidth,
    minImageHeight
  } = opts

  const promises = [
    resolveEmbeddedMedia($, opts)
  ]

  if (opts.iframely) {
    promises.push(resolveExternalMedia($, opts))
  }

  let [
    embedded,
    external
  ] = await Promise.all(promises)

  // If were not using iframely anymore
  external = external || []

  embedded.forEach((item) => {
    if (item.link) {
      for (let i = 0; i < external.length; ++i) {
        const source = external[i]

        if (source.node === item.link) {
          overwriteNonEmptySentence(source, item, 'title')
          overwriteNonEmptySentence(source, item, 'description')
          overwriteNonEmptySentence(source, item, 'keywords')
          overwriteNonEmptySentence(source, item, 'sentence')
          return
        }
      }
    }

    // TODO: img not contained in link, so find closest tag which we could
    // possibly use as a label to describe the image...
  })

  const aggregate = embedded.concat(external)

  const media = (await pMap(aggregate, async (item) => {
    const { asset } = item
    // console.log(JSON.stringify(asset, null, 2))

    try {
      const size = await module.exports.getImageSize(asset.url)

      if (size.width < minImageWidth || size.height < minImageHeight) {
        return
      }

      asset.width = size.width
      asset.height = size.height

      return item
    } catch (err) {
      console.warn('media resolve error', asset.url, err)
    }
  }, {
    concurrency
  })).filter(Boolean)

  return uniqueBy(media, (item) => item.asset.url)
}

module.exports.getImageSize = (url) => {
  return pRetry(() => requestImageSize(url), {
    retries: 1,
    minTimeout: 1000
  })
}

function overwriteNonEmptySentence (source, dest, key) {
  if (!dest[key].tokenized.length) {
    dest[key] = source[key]
  }
}
