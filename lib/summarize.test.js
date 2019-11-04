'use strict'

const test = require('ava')
const fs = require('fs')
const path = require('path')

const summarize = require('./summarize')

const fixtures = path.join(__dirname, '../fixtures')

fs.readdirSync(fixtures).forEach((filename) => {
  test(filename, async (t) => {
    const html = fs.readFileSync(path.join(fixtures, filename))
    const result = await summarize({ html })
    t.snapshot(result)
  })
})
