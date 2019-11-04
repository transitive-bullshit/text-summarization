/**
 * Performs basic abstractive summarization to shorten input text using several
 * rule-based heuristics.
 *
 * TODO: more advanced abstractive textsum
 */

'use strict'

const capitalize = require('capitalize')
const isCapitalized = require('is-capitalized')
const util = require('util')

const retext = require('retext')
const simplify = require('retext-simplify')
const redundantAcronyms = require('retext-redundant-acronyms')
const repeatedWords = require('retext-repeated-words')

const re = retext()
  .use(simplify)
  .use(redundantAcronyms)
  .use(repeatedWords)
const reProcess = util.promisify(re.process.bind(re))

const ruleBlacklist = new Set([
  'type',
  'effect'
])

module.exports = async (text) => {
  let shortened = text

  do {
    const file = await reProcess(shortened)
    if (!file.messages.length) {
      break
    }

    let index = 0
    let message

    do {
      message = file.messages[index++]
    } while (message && ruleBlacklist.has(message.ruleId))

    if (!message) {
      break
    }

    const prefix = shortened.slice(0, message.location.start.offset)
    let suffix = shortened.slice(message.location.end.offset)
    let body = message.expected[0] || ''

    if (isCapitalized(message.actual)) {
      if (body.length) {
        body = capitalize(body)
      } else {
        suffix = capitalize(normalize(suffix))
      }
    }

    shortened = normalize(`${prefix}${body}${suffix}`)
  } while (true)

  return shortened
}

function normalize (text) {
  return text
    .replace(/^\s*[,.:;-]\s*/gm, '')
    .replace(/\s*[,;-]\s*$/gm, '')
    .trim()
}
