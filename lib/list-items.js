/**
 * Attempt to score list items higher if they come in one consecutive span, like:
 *
 * 1. first point
 * 2. second point
 * 3. last point
 */

'use strict'

module.exports = (listItems) => {
  const items = listItems
    .map((li, index) => ({ li, index, score: 1.0 }))
    .filter((item) => (item.li && item.li > 0))

  let listicle = 0
  const scores = []

  if (items.length) {
    let min = Infinity
    let max = 0
    let weight = 0

    items.forEach(({ li }) => {
      min = Math.min(min, li)
      max = Math.max(max, li)
    })

    const span = (max - min + 1)

    if (span === items.length) {
      weight = 1.0

      if (span > 2) {
        listicle = span
      }
    } else if (span < items.length) {
      weight = 0.4

      // TODO
      /*
      let curMin = Infinity
      let curMax = 0

      items.forEach((item) => {
        const { li } = item
      })
      */
    } else {
      weight = 0.2
    }

    if (items.length < 2 || items.length > 20) {
      weight /= 10
    }

    items.forEach(({ index, score }, i) => {
      while (scores.length < index) {
        scores.push(0)
      }

      const w = weight * score
      scores.push(w)
    })
  }

  while (scores.length < listItems.length) {
    scores.push(0)
  }

  return {
    scores,
    listicle
  }
}
