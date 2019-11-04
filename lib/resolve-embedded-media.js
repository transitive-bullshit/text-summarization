/**
 * TODO: support other forms of primary media such as gifs and videos.
 */

'use strict'

const pMap = require('p-map')

const createMediaAsset = require('./create-media-asset')
const normalizeSentence = require('./normalize-sentence')
const uniqueBy = require('./unique-by')

module.exports = async ($, opts) => {
  const {
    concurrency = 8
  } = opts

  const images = $('img').get()
    .map((img) => {
      const $img = $(img)

      return {
        src: encodeURI($img.attr('src')),
        alt: $img.attr('alt'),
        node: img
      }
    })
    .filter((image) => {
      return image.src && image.src.length
    })

  const uniqueImages = uniqueBy(images, 'src')

  const media = (await pMap(uniqueImages, async (image) => {
    const { src, alt, node } = image

    try {
      const asset = createMediaAsset({ url: src })

      const meta = {
        title: alt || '',
        description: '',
        keywords: ''
      }

      const $node = $(node)
      const caption = $node.next('figcaption').get(0)
      if (caption) {
        meta.description = $(caption).text()
      }

      const link = $node.parentsUntil('body')
        .get()
        .reduce((link, node) => {
          return link || (node.tagName === 'a' && node)
        }, null)

      return {
        embedded: true,
        asset,
        node,
        link,
        sentence: normalizeSentence(''),
        title: normalizeSentence(meta.title),
        description: normalizeSentence(meta.description),
        keywords: normalizeSentence(meta.keywords)
      }
    } catch (err) {
      console.warn('embedded media error', src, err.message)
    }
  }, {
    concurrency
  })).filter(Boolean)

  return uniqueBy(media, (item) => item.asset.url)
}
