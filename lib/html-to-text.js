'use strict'

module.exports = ($) => {
  return $.text()
    .replace(/\\n/g, '\n')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+/gm, '')
    .replace(/\s+$/gm, '')
    .trim()
}
