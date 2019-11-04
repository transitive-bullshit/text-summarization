'use strict'

const test = require('ava')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')

const htmlToText = require('./html-to-text')

const cases = [
  {
    input: 'automagical-1.html',
    output: 'Why you should drop everything and try Automagical\n1. Video content is significantly more engaging than text content\nhttps://veed.me/blog/video-ads-vs-text-ads/\n2. Go from blog post → video in 5 minutes. Let our AI engine do the heavy lifting for you so you can quickly edit and publish your videos. Here’s an example of a post that was created from a blog article to a video in Automagical in about 10 minutes:\n3. Our builder is exceptionally easy to use. Quickly edit text, search through our massive free library of media assets (images, videos, gifs), add your own visual media, or add custom branding.\n4. For the cost of 1 highly produced video, you can get a year’s worth of videos from Automagical. A good rule of thumb is that it costs about $1,000 for 60 seconds of finished video when it’s created by a a production team. We wanted to bring affordability and scale to small businesses and entrepreneurs who want to compete in video inbound marketing.\n5. We’re here for you. We take great pride in our customer support, and we commit to continuously adding and building new features for you that will keep your automated video content on the cutting edge of technology and quality.\nAnd for fun, here’s this very post that we turned into a video… Automagically.\nBe Creative. ❤ The Automagical Team.'
  }
]

cases.forEach(({ input, output }) => {
  test(input, (t) => {
    const html = fs.readFileSync(path.join(__dirname, `../fixtures/${input}`))
    const $ = cheerio.load(html)
    const result = htmlToText($)
    t.deepEqual(result, output)
  })
})
