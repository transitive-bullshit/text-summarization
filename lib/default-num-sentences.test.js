'use strict'

const test = require('ava')
const defaultNumSentences = require('./default-num-sentences')

const cases = [
  { input: 5, output: 3 },
  { input: 50, output: 8 },
  { input: 100, output: 10 },
  { input: 22, output: 5 },
  { input: 36, output: 7 },
  { input: 10000, output: 10 },
  { input: 1, output: 1 }
]

cases.forEach(({ input, output }) => {
  test(`"${input}"`, (t) => {
    const result = defaultNumSentences(input)
    t.deepEqual(result, output)
  })
})
