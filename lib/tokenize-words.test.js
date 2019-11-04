'use strict'

const test = require('ava')
const tokenize = require('./tokenize-words')

const cases = [
  {
    input: 'test mr. fuzzy',
    output: ['test', 'fuzzy']
  },
  {
    input: 'automagically turn blog posts into videos',
    output: ['automagically', 'turn', 'blog', 'posts', 'videos']
  },
  {
    input: 'the man is old and hairy',
    output: ['man', 'hairy']
  }
]

cases.forEach(({ input, output }) => {
  test(`"${input}"`, (t) => {
    const result = tokenize(input)
    t.deepEqual(result, output)
  })
})
