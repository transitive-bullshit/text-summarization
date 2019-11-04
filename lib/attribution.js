'use strict'

const fullImageCreditRe = /^(photo|image) *(by|credit|from) .*(unsplash|pexels|pixabay|flickr|getty)/
const partialImageCreditRe = /^(photo|image) *(by|credit|from)/

module.exports = async (sentence) => {
  if (sentence.normalized.match(fullImageCreditRe)) {
    return 1
  }

  if (sentence.normalized.match(partialImageCreditRe)) {
    return 0.5
  }

  return 0
}
