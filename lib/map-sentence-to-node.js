'use strict'

const normalize = require('./normalize')

const nodeNameToWeightMap = {
  p: 0.0,
  h1: 5.0,
  h2: 4.0,
  h3: 3.5,
  h4: 2.0,
  h5: 1.5,
  strong: 1.0,
  b: 1.0,
  blockquote: 0.4,
  ol: 1.0,
  ul: 0.5,
  li: 0.3,
  em: 0.3,
  i: 0.3,
  a: 0.3
}

module.exports = (sentence, $) => {
  const { normalized } = sentence
  let $nodes = $('*', 'body')
    .filter((i, el) => {
      return el.children.some((c) => {
        return (c.type === 'text' && c.data && normalize(c.data).indexOf(normalized) >= 0)
      })
    })

  if (!$nodes.length) {
    $nodes = $('*', 'body')
      .filter((i, el) => {
        return (normalize($(el).text()).indexOf(normalized) >= 0)
      })
      .slice(0, 1)
  }

  let node = null
  let score = 0

  if ($nodes.length > 0) {
    if ($nodes.length > 1) {
      // TODO: handle case where multiple text nodes match
      node = $nodes[0]
    } else {
      node = $nodes[0]
    }
  } else {
    // TODO: handle case where node is not found by splitting up sentence
  }

  if (node) {
    const $node = $(node)

    // extract info about node and its parents
    const path = [node].concat($node.parentsUntil('body').get())
    const base = node

    path.forEach((node) => {
      const { name } = node
      const w = nodeNameToWeightMap[name]
      if (w) score += w

      if (name === 'ol' && !sentence.listItem) {
        const index = $(node)
          .find('li')
          .get()
          .findIndex((li) => li === base)

        if (index >= 0) {
          sentence.listItem = index + 1
        }
      }
    })

    // extract info about node's direct children
    const children = $node.children().get()
    let childrenScore = 0
    children.forEach((node) => {
      const { name } = node
      if (!name) return

      const text = normalize($(node).text())

      if (normalized.indexOf(text) >= 0) {
        const w = nodeNameToWeightMap[name]
        if (w) childrenScore = Math.max(childrenScore, w)
      }
    })

    score += childrenScore
  }

  return {
    node,
    score
  }
}
