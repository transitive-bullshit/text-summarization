'use strict'

const natural = require('natural')
const stopwords = require('stopwords')

module.exports = new Set(stopwords.english)
module.exports.lite = new Set(natural.stopwords)
