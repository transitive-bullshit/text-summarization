'use strict'

const test = require('ava')
const listItems = require('./list-items')

test('[ ]', (t) => {
  t.deepEqual(listItems([]), {
    scores: [],
    listicle: 0
  })
})

test('[ 0, 0, 0, undefined ]', (t) => {
  t.deepEqual(listItems([0, 0, 0, undefined]), {
    scores: [0, 0, 0, 0],
    listicle: 0
  })
})

test('[ 1, 2, 3, 4 ]', (t) => {
  t.deepEqual(listItems([1, 2, 3, 4]), {
    scores: [1, 1, 1, 1],
    listicle: 4
  })
})

test('[ 0, 1, 2, 0, 0, 0, 3, 4, 0 ]', (t) => {
  t.deepEqual(listItems([0, 1, 2, 0, 0, 3, 4, 0]), {
    scores: [0, 1, 1, 0, 0, 1, 1, 0],
    listicle: 4
  })
})

test('[ 1, 2, 4 ]', (t) => {
  t.deepEqual(listItems([1, 2, 4]), {
    scores: [0.2, 0.2, 0.2],
    listicle: 0
  })
})

test('[ 1 ]', (t) => {
  t.deepEqual(listItems([1]), {
    scores: [0.1],
    listicle: 0
  })
})

test('[ 0, 0, 0, 1, 2, 3, 0, 0, 1, 2, 3, 4 ]', (t) => {
  t.deepEqual(listItems([0, 0, 0, 1, 2, 3, 0, 0, 1, 2, 3, 4]), {
    scores: [0, 0, 0, 0.4, 0.4, 0.4, 0, 0, 0.4, 0.4, 0.4, 0.4],
    listicle: 0
  })
})
