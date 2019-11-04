/**
 * Normalizes an input sentence for internal processing.
 */

'use strict'

const capitalize = require('capitalize')

const normalize = require('./normalize')
const tokenize = require('./tokenize-words')

const listItemRe = /^(\d+)[.):]\s*/
const fuzzyListItemRe = /(\d+)[):]\s+[\w\d]/
const publisherRe = /^(\([A-Z]+\))\s*-*\s*/
const invalidStartRe = /^([-–;:,]+)/
const invalidEndRe = /([-–;,]+)$/

module.exports = (sentence) => {
  const original = sentence.trim()
  const result = { original }

  let actual = original

  const listItem = actual.match(listItemRe)
  if (listItem) {
    result.listItem = parseInt(listItem[1])
    actual = actual.slice(listItem[0].length)
  } else {
    const fuzzyListItem = actual.match(fuzzyListItemRe)
    if (fuzzyListItem) {
      result.listItem = parseInt(fuzzyListItem[1])
    }
  }

  const publisher = actual.match(publisherRe)
  if (publisher) {
    actual = actual.slice(publisher[0].length)
  }

  const invalidStart = actual.match(invalidStartRe)
  if (invalidStart) {
    actual = actual.slice(invalidStart[0].length)
  }

  const invalidEnd = actual.match(invalidEndRe)
  if (invalidEnd) {
    actual = actual.slice(0, actual.length - invalidEnd[0].length)
  }

  if (actual.length > 7 && actual.toUpperCase() === actual) {
    actual = capitalize(actual.toLowerCase())
  }

  result.actual = actual
  result.normalized = normalize(actual)
  result.tokenized = tokenize(result.normalized)

  return result
}
