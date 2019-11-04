'use strict'

const test = require('ava')
const normalizeSentence = require('./normalize-sentence')

const cases = [
  {
    input: ' Petting Tiny Kittens. \n',
    output: {
      original: 'Petting Tiny Kittens.',
      actual: 'Petting Tiny Kittens.',
      normalized: 'petting tiny kittens',
      tokenized: ['petting', 'tiny', 'kittens']
    }
  },
  {
    input: '3. List Item',
    output: {
      original: '3. List Item',
      actual: 'List Item',
      normalized: 'list item',
      tokenized: ['list', 'item'],
      listItem: 3
    }
  },
  {
    input: '13)  Test McTestFace',
    output: {
      original: '13)  Test McTestFace',
      actual: 'Test McTestFace',
      normalized: 'test mctestface',
      tokenized: ['test', 'mctestface'],
      listItem: 13
    }
  },
  {
    input: 'Help Won’t arrive don\'t Dr. Seuss test-code',
    output: {
      original: 'Help Won’t arrive don\'t Dr. Seuss test-code',
      actual: 'Help Won’t arrive don\'t Dr. Seuss test-code',
      normalized: 'help wont arrive dont dr seuss testcode',
      tokenized: ['arrive', 'dr', 'seuss', 'testcode']
    }
  },
  {
    input: '-;test 123,',
    output: {
      original: '-;test 123,',
      actual: 'test 123',
      normalized: 'test 123',
      tokenized: ['test', '123']
    }
  },
  {
    input: 'I SWEAR IM NOT YELLING,',
    output: {
      original: 'I SWEAR IM NOT YELLING,',
      actual: 'I swear im not yelling',
      normalized: 'i swear im not yelling',
      tokenized: ['swear', 'yelling']
    }
  }
]

cases.forEach(({ input, output }) => {
  test(`"${input}"`, (t) => {
    const result = normalizeSentence(input)
    t.deepEqual(result, output)
  })
})
