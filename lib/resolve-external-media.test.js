'use strict'

const test = require('ava')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

const resolveExternalMedia = require('./resolve-external-media')

const opts = {
  minImageWidth: 400,
  minImageHeight: 360,
  iframely: {
    baseUrl: '$http://iframely-base-url-test$'
  }
}

const sandbox = sinon.sandbox.create()

test.before((t) => {
  sandbox.stub(resolveExternalMedia, 'iframely')
    .callsFake(async (opts) => {
      t.deepEqual(opts.baseUrl, '$http://iframely-base-url-test$')
      t.truthy(opts.href)

      return {
        meta: {
          title: 'title-test',
          description: 'description-test',
          keywords: 'keywords-test',
          canonical: 'canonical-test'
        },
        links: {
          thumbnail: [
            {
              href: '$http://thumbnail-href-test$'
            }
          ]
        }
      }
    })
})

test.after(() => sandbox.restore())

test('gear-junkie-3', async (t) => {
  const html = fs.readFileSync(path.join(__dirname, '../fixtures/gear-junkie-3.html'))
  const $ = cheerio.load(html)

  const results = await resolveExternalMedia($, opts)

  results.forEach((result) => {
    t.false(result.embedded)
    t.truthy(result.title)
    t.truthy(result.description)
    t.truthy(result.keywords)
    t.truthy(result.node)
    t.truthy(result.sentence)
    t.truthy(result.asset)
  })
})
