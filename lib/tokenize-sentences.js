'use strict'

const tokenizer = require('sbd')

module.exports = (text) => {
  return tokenizer.sentences(text, {
    newline_boundaries: true
  })
}
