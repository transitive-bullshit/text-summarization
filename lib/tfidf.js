/**
 * References
 *   https://thetokenizer.com/2013/04/28/build-your-own-summary-tool/
 */

'use strict'

module.exports = (tokenizedSentences) => {
  const n = tokenizedSentences.length
  const weights = { }
  const scores = []

  for (let i = 0; i < n; ++i) {
    const tokensI = tokenizedSentences[i]
    weights[i] = { }

    for (let j = i + 1; j < n; ++j) {
      const tokensJ = tokenizedSentences[j]

      const intersection = tokensI.filter(Set.prototype.has, new Set(tokensJ))
      const weight = intersection.length / (tokensI.length + tokensJ.length)

      weights[i][j] = weight
    }
  }

  for (let i = 0; i < n; ++i) {
    let score = 0

    for (let j = 0; j < n; ++j) {
      if (i === j) continue

      if (i < j) {
        score += weights[i][j]
      } else {
        score += weights[j][i]
      }
    }

    score /= n
    scores.push(score)
  }

  return scores
}
