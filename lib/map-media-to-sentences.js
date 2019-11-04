/**
 * Attempts to intellegently match media items to their best corresponding
 * summary sentence(s).
 *
 * TODO: scoring of similarity vs distance needs work
 * TODO: run this on all source sentences? or only top summary sentences?
 */

'use strict'

module.exports = ($, media, sentences, opts = { }) => {
  const minScore = opts.minScore || 0
  const scores = []

  const n = sentences.length
  const m = media.length

  for (let i = 0; i < m; ++i) {
    const {
      node: mediaNode,
      title,
      description,
      keywords,
      sentence
    } = media[i]

    const mediaTokenScores = { }

    addWeightedTokens(mediaTokenScores, title, 4)
    addWeightedTokens(mediaTokenScores, description, 2)
    addWeightedTokens(mediaTokenScores, keywords, 0.5)
    addWeightedTokens(mediaTokenScores, sentence, 2.5)

    for (let j = 0; j < n; ++j) {
      const { node, sentence } = sentences[j]
      const { tokenized } = sentence

      // estimate similarity by number of tokens which overlap
      let similarityScore = 0
      tokenized.forEach((token) => {
        similarityScore += (mediaTokenScores[token] || 0)
      })
      similarityScore /= tokenized.length

      // estimate distance between media and sentence in source html
      // the closer the two are, the more relevant they are to each other
      const dist = getNodeDist($(mediaNode), node && $(node.node))
      const distScore = Math.max(0, Math.min(1, 1.0 - (dist * $.scale)))

      const score = 2 * similarityScore + distScore
      scores.push({ i, j, score })
    }
  }

  scores.sort((a, b) => b.score - a.score)

  const results = {
    mediaToSentence: { },
    sentenceToMedia: { }
  }

  let index = 0

  while (index < scores.length) {
    const { i, j, score } = scores[index++]

    if (score < minScore) {
      break
    }

    if (!results.mediaToSentence[i] && !results.sentenceToMedia[j]) {
      const sentence = sentences[j]
      sentence.mediaScore = score
      results.mediaToSentence[i] = sentence
      results.sentenceToMedia[j] = media[i]
    }
  }

  return results
}

function addWeightedTokens (result, sentence, weight) {
  const { tokenized } = sentence
  if (!tokenized.length) return

  // normalize the shit out of this shit
  const w = weight / tokenized.length

  tokenized.forEach((token) => {
    result[token] = (result[token] || 0) + w
  })
}

function getNodeDist ($nodeA, $nodeB) {
  const distA = $nodeA ? parseInt($nodeA.attr('id')) : 0
  const distB = $nodeB ? parseInt($nodeB.attr('id')) : 0

  return Math.abs(distA - distB)
}
