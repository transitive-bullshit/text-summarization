'use strict'

const test = require('ava')
const summarize = require('.')

test('basic', async (t) => {
  t.truthy(summarize)
  t.truthy(typeof summarize === 'function')
})
