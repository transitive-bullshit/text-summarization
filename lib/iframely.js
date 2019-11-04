/**
 * https://iframely.com/docs/iframely-api
 */

'use strict'

const request = require('request-promise-native').defaults({
  json: true
})

module.exports = async (opts) => {
  const {
    baseUrl,
    url,
    ...rest
  } = opts

  if (!(baseUrl && url)) {
    throw new Error('iframely missing required param')
  }

  console.log(`>>> iframely fetching "${url}"`)
  const result = await request({
    baseUrl,
    uri: '/iframely',
    qs: {
      url,
      media: 1,
      html5: 1,
      ...rest
    }
  })
  console.log(`<<< iframely done fetching "${url}"`)

  return result
}

/* example response
{
  meta: {
    title: 'Valley Uprising | Netflix',
    description: 'The 50-year history of rock climbing in Yosemite Valley is chronicled in this documentary charting the birth and rise of a rebellious counterculture.',
    keywords: 'watch movies, movies online, watch TV, TV online, TV shows online, watch TV shows, stream movies, stream tv, instant streaming, watch online, movies, watch movies United States, watch TV online, no download, full length movies',
    canonical: 'https://www.netflix.com/title/80084836'
  },
  links: {
    thumbnail: [
      {
        href: 'https://art-s.nflximg.net/e5fed/4ae3b89939d264a468dcd304a2724d77285e5fed.jpg',
        type: 'image/jpeg',
        rel: [ 'thumbnail', 'og', 'ssl' ]
      }
    ],
    icon: [
      {
        href: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png',
        rel: [Array],
        type: 'image/png'
      },
      {
        href: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
        rel: [Array],
        type: 'image/icon'
      }
    ]
  },
  rel: []
}
*/
