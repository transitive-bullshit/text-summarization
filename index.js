#!/usr/bin/env node
'use strict'

module.exports = require('./lib/summarize')

if (!module.parent) {
  require('./lib/cmd')(process.argv)
}
