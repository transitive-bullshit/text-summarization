'use strict'

// TODO: normalize all nouns to singular and verbs to infinitive form

// const natural = require('natural')
// const nounInflector = new natural.NounInflector()

module.exports = (text) => {
  return text
    .toLowerCase()
    .replace(/[’'-.]/g, '')
    .replace('’', '')
    .trim()
}
