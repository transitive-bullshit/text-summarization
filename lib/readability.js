'use strict'

const util = require('util')
const retext = require('retext')
const readability = require('retext-readability')
const re = retext().use(readability)
const reProcess = util.promisify(re.process.bind(re))

module.exports = async (text) => {
  const file = await reProcess(text)
  let score = 0

  const message = file.messages[0]
  if (message) {
    score = 2 * parseInt(message.confidence[0]) / 7.0
  }

  if (text.length > 100) {
    score += Math.max(0, Math.min(1, (text.length - 80) / 120))
  }

  return score
}
