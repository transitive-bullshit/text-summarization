'use strict'

const test = require('ava')
const normalizeSentence = require('./normalize-sentence')
const attribution = require('./attribution')

const cases = [
  {
    input: normalizeSentence('photo credit tim from unsplash'),
    output: 1.0
  },
  {
    input: normalizeSentence('image from flickr'),
    output: 1.0
  },
  {
    input: normalizeSentence('photo by my friend bob'),
    output: 0.5
  },
  {
    input: normalizeSentence('normal sentence with a photo by jim'),
    output: 0
  },
  {
    input: normalizeSentence('normal sentence with an image credit from unsplash'),
    output: 0
  },
  {
    input: normalizeSentence('i am a normal sentence'),
    output: 0
  }
]

cases.forEach(({ input, output }) => {
  test(`"${input.normalized}"`, async (t) => {
    const result = await attribution(input)
    t.is(result, output)
  })
})
