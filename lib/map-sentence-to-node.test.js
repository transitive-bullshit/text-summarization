'use strict'

const test = require('ava')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')

const mapSentenceToNode = require('./map-sentence-to-node')

const $ = cheerio.load(fs.readFileSync(path.join(__dirname, '../fixtures/automagical-1.html')))
const $1 = cheerio.load(fs.readFileSync(path.join(__dirname, '../fixtures/under-armour-1.html')))

test('<p>', (t) => {
  const input = { normalized: 'be creative' }
  const {
    node,
    score
  } = mapSentenceToNode(input, $)

  t.deepEqual(node.name, 'p')
  t.deepEqual(score, 0)
})

test('<strong>', (t) => {
  const input = { normalized: 'video content is significantly more engaging than text content' }
  const {
    node,
    score
  } = mapSentenceToNode(input, $)

  t.deepEqual(node.name, 'strong')
  t.deepEqual(score, 1.0)
})

test('<h1>', (t) => {
  const input = { normalized: 'why you should drop everything and try automagical' }
  const {
    node,
    score
  } = mapSentenceToNode(input, $)

  t.deepEqual(node.name, 'h1')
  t.deepEqual(score, 5.0)
})

test('html escape codes', (t) => {
  const input = { normalized: 'you can get a years worth of videos' }
  const {
    node,
    score
  } = mapSentenceToNode(input, $)

  t.deepEqual(node.name, 'strong')
  t.deepEqual(score, 1.0)
})

test('node with multiple child spans', (t) => {
  const input = { normalized: 'rule number 3: stop consuming alcohol three hours before bedtime' }
  const {
    node,
    score
  } = mapSentenceToNode(input, $1)

  t.deepEqual(node.name, 'p')
  t.deepEqual(score, 1.0)
})
