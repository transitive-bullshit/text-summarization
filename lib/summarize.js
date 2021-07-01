/**
 * Combines several metrics of sentence importance together to generate a
 * summarized version of html.
 *
 * TODO: tfidf scores aren't really normalized properly
 */

'use strict'

const isEqual = require('lodash.isequal')

const createDocument = require('./create-document')
const defaultNumSentences = require('./default-num-sentences')
const listItems = require('./list-items')
const mapMediaToSentences = require('./map-media-to-sentences')
const mapSentenceToNode = require('./map-sentence-to-node')
const normalizeSentence = require('./normalize-sentence')
const readability = require('./readability')
const attribution = require('./attribution')
const resolveMedia = require('./resolve-media')
const shorten = require('./shorten-text-abstractive')
const tfidf = require('./tfidf')
const tokenizeSentences = require('./tokenize-sentences')
const uniqueBy = require('./unique-by')

module.exports = async (opts) => {
  const {
    minNumSentences = 1,
    maxNumSentences = Infinity,
    minImageWidth = 400,
    minImageHeight = 360,
    media: shouldResolveMedia,
    filter,
    title,
    ...rest
  } = opts

  if (!opts.html && !opts.text) {
    throw new Error('summarize: missing required param "html" or "text"')
  }

  // pre-process input
  const { $, text } = createDocument(opts)
  const titleNorm = (title && normalizeSentence(title))

  const rawSentences = tokenizeSentences(text)
    .map((s) => normalizeSentence(s))

  const sentences = uniqueBy(rawSentences, 'normalized')

  const nodes = sentences
    .map((sentence) => mapSentenceToNode(sentence, $))

  // filter invalid candidate sentences
  const inputs = sentences.map((sentence, i) => {
    if (!sentence.normalized.length) return
    if (!sentence.tokenized.length) return
    if (filter && !filter(sentence.actual)) return

    return {
      sentence,
      node: nodes[i]
    }
  }).filter(Boolean)

  // compute sentence scores for various metrics
  const tfidfScores = tfidf(inputs.map((input) => input.sentence.tokenized))

  const {
    scores: liScores,
    listicle
  } = listItems(inputs.map((input) => input.sentence.listItem))

  const readabilityPenalties = await Promise.all(
    inputs.map((input) => readability(input.sentence.actual))
  )

  const attributionPenalties = await Promise.all(
    inputs.map((input) => attribution(input.sentence))
  )

  // compute aggregate sentence scores
  const items = inputs.map((input, index) => {
    const { sentence, node } = input
    const liScore = 3 * liScores[index]
    const nodeScore = 4 * node.score
    const readabilityScore = -5 * readabilityPenalties[index]
    const attributionScore = -10 * attributionPenalties[index]
    const tfidfScore = 50 * tfidfScores[index]

    // TODO: this formula needs a lot more love
    const score = (
      liScore +
      nodeScore +
      tfidfScore +
      readabilityScore +
      attributionScore
    )

    return {
      index,
      node,
      sentence,
      liScore,
      nodeScore,
      readabilityScore,
      attributionScore,
      tfidfScore,
      score
    }
  })

  // sort sentences by aggregate score
  items.sort((a, b) => b.score - a.score)

  // infer number of desired sentences in output summary
  const numSentencesHardConstraint = !!opts.numSentences
  let desiredNumSentences = opts.numSentences ? (
    typeof opts.numSentences === 'function'
      ? opts.numSentences(sentences.length)
      : opts.numSentences
  ) : defaultNumSentences(sentences.length)

  if (listicle && !numSentencesHardConstraint) {
    const avg = (desiredNumSentences + listicle) / 2
    desiredNumSentences = Math.max(desiredNumSentences, avg)
  }

  const min = Math.min(minNumSentences, sentences.length)
  const max = Math.min(maxNumSentences, sentences.length)
  const numSentences = Math.max(min, Math.min(max, desiredNumSentences))

  // take top N sentences sorted by their order in the input text
  let topItems = items
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index)

  // add title to summary if it's not a duplicate of an existing top sentence
  if (titleNorm && titleNorm.actual.length > 0) {
    const existingTitle = topItems.findIndex((s) => (s.sentence.normalized === titleNorm.normalized))

    if (existingTitle < 0) {
      const titleItem = {
        sentence: titleNorm,
        index: -1
      }

      topItems = [titleItem].concat(topItems)
    } else if (existingTitle > 0) {
      // ensure title is first
      topItems[existingTitle].index = -1
      topItems = topItems.sort((a, b) => a.index - b.index)
    }
  }

  if (shouldResolveMedia) {
    const media = await resolveMedia($, {
      minImageWidth,
      minImageHeight,
      ...rest
    })
    const mediaMapping = mapMediaToSentences($, media, topItems)

    topItems.forEach((item, index) => {
      const media = mediaMapping.sentenceToMedia[index]

      if (media) {
        const title = media.title || media.sentence

        item.media = {
          ...media.asset,
          embedded: media.embedded,
          title: title && title.actual
        }
      }
    })
  }

  const extractive = topItems
    .map(({ sentence }) => sentence.actual)

  let abstractive = await Promise.all(
    extractive.map((sentence) => shorten(sentence))
  )

  if (isEqual(abstractive, extractive)) {
    abstractive = undefined
  }

  const result = {
    title,
    extractive,
    abstractive
  }

  if (opts.detailed || opts.detailedAll) {
    items.forEach((item) => {
      delete item.node
    })

    result.topItems = topItems

    if (opts.detailedAll) {
      result.items = items
    }
  }

  return result
}

module.exports.normalizeSentence = normalizeSentence
