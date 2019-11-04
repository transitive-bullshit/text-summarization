/**
 * Parses the input html and extracts raw text.
 *
 * Also computes a simple measure of distance across all nodes in an html
 * document that will be useful later for matching images with text nodes.
 *
 * TODO: distance should include number of tokens or sentences inbetween nodes.
 * TODO: definitely needs unit tests
 */

'use strict'

const cheerio = require('cheerio')
const htmlToText = require('./html-to-text')

const tagsToIgnore = new Set([
  'figure',
  'strong',
  'b',
  'i',
  'em',
  'a'
])

module.exports = (opts) => {
  let $, text

  if (opts.html) {
    $ = cheerio.load(opts.html)
    text = htmlToText($)
  } else if (opts.text) {
    text = opts.text.replace(/[\r\n]/g, ' ').replace(/ {2}/g, ' ')

    $ = cheerio.load(`
<p>
${text}
</p>
`)
  } else {
    throw new Error('invalid input; missing required "html" or "text"')
  }

  const $root = $($('body').children().get(0))
  const length = initDistanceDFS($, $root, 0)
  $.scale = 1.0 / length

  return {
    text,
    $
  }
}

function initDistanceDFS ($, $node, index) {
  $node.attr('id', index)

  const nextIndex = $node
    .children()
    .get()
    .reduce((index, child) => {
      const { tagName } = child
      const increment = tagsToIgnore.has(tagName)
        ? 0
        : 1

      return initDistanceDFS($, $(child), index + increment)
    }, index)

  const next = $node.next().get(0)

  if (next) {
    return initDistanceDFS($, $(next), nextIndex + 1 + $node.text().length)
  } else {
    return nextIndex + $node.text().length
  }
}
