'use strict'

const normalize = require('./normalize')
const stopwords = require('./stopwords')
const natural = require('natural')

const tokenizer = new natural.TreebankWordTokenizer()

module.exports = (text) => {
  return tokenizer.tokenize(text)
    .map((token) => normalize(token))
    .filter((token) => token.length > 1 && !stopwords.has(token))
}
