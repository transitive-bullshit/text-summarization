'use strict'

const parseUrl = require('url-parse')

const extWhitelist = new Set([
  // videos
  'gif',
  'mp4',
  'webm',
  'mkv',
  'mov',
  'avi',

  // images
  'bmp',
  'jpg',
  'jpeg',
  'png',
  'tif',
  'webp',

  // audio
  'mp3',
  'aac',
  'wav',
  'flac',
  'opus',
  'ogg'
])

module.exports = (url, opts = { strict: true }) => {
  const { pathname } = parseUrl(url)
  const parts = pathname.split('.')
  const ext = (parts[parts.length - 1] || '').trim().toLowerCase()

  if (!opts.strict || extWhitelist.has(ext)) {
    return ext
  }

  if (url.indexOf('fm=jpg') >= 0 || url.indexOf('fm=jpeg') >= 0) {
    return 'jpg'
  }

  if (url.indexOf('fm=png') >= 0) {
    return 'png'
  }
}
