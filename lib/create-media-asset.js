'use strict'

const getFileExt = require('./get-file-ext')

module.exports = ({ url, ...rest }) => {
  const ext = getFileExt(url)

  return {
    type: (ext === 'gif' ? 'gif' : 'image'),
    url,
    ...rest
  }
}
