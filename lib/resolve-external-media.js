/**
 * Extracts links from html and runs them through a hosted iframely opengraph
 * service to resolve relevant images. For each opengraph image preview, we
 * parse its metadata and fetch the image size to ensure it's of sufficient
 * quality to use.
 *
 * TODO: support other forms of primary media such as gifs and videos.
 */

'use strict'

const pMap = require('p-map')
const pRetry = require('p-retry')

const createMediaAsset = require('./create-media-asset')
const normalizeSentence = require('./normalize-sentence')
const uniqueBy = require('./unique-by')

module.exports = async ($, opts) => {
  const {
    concurrency = 8,
    maxLinks = 20,
    iframely
  } = opts

  const links = $('a').get()
    .map((a) => {
      const $a = $(a)
      const sentence = normalizeSentence($a.text())

      return {
        href: $a.attr('href'),
        alt: $a.attr('alt'),
        node: a,
        sentence
      }
    })

  const uniqueLinks = uniqueBy(links, 'href')
    .slice(0, maxLinks)

  const media = (await pMap(uniqueLinks, async (link) => {
    const { href, node, sentence } = link

    try {
      const result = await module.exports.resolveMedia({
        ...iframely,
        url: href
      })

      const {
        meta,
        links
      } = result

      const media = links.image || links.thumbnail
      if (!media || !media.length) {
        return
      }

      const asset = createMediaAsset({ url: media[0].href })

      return {
        embedded: false,
        asset,
        node,
        sentence,
        title: normalizeSentence(meta.title || ''),
        description: normalizeSentence(meta.description || ''),
        keywords: normalizeSentence(meta.keywords || ''),
        canonical: meta.canonical
      }
    } catch (err) {
      console.warn('external media error', href, err.message)
    }
  }, {
    concurrency
  })).filter(Boolean)

  return uniqueBy(media, (item) => item.asset.url)
}

module.exports.resolveMedia = async (opts) => {
  return pRetry(() => module.exports.iframely(opts), {
    retries: 1,
    minTimeout: 1000
  })
}

module.exports.iframely = require('./iframely')
