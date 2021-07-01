# text-summarization

> Automagically generates summaries from html or text.

[![NPM](https://img.shields.io/npm/v/text-summarization.svg)](https://www.npmjs.com/package/text-summarization) [![Build Status](https://travis-ci.com/transitive-bullshit/text-summarization.svg?branch=master)](https://travis-ci.com/transitive-bullshit/text-summarization) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Intro

This module powers Automagical's text summarization, which was [acquired by Verblio in 2018](https://www.verblio.com/blog/we-bought-a-company).

It provides the most powerful and comprehensive text summarization available on NPM.

## Features

- Uses a variety of metrics to generate quality extractive text summaries
- Handles html or text-based content
- Utilizes html structure as a signal of text importance
- Includes basic abstractive shortening of extracted sentences
- Usable as a node module or cli
- Thoroughly tested and used in production

## Install

This module is usable either as a CLI or as a module.

```bash
npm install --save text-summarization
```

## Usage

```js
const summarize = require('text-summarization')

const fs = require('fs')
const html = fs.readFileSync('fixtures/automagical-1.html')

const summary = await summarize({ html })
console.log(JSON.stringify(summary, null, 2))
```

which outputs:

```
{
  "extractive": [
    "Why you should drop everything and try Automagical",
    "Video content is significantly more engaging than text content",
    "Go from blog post → video in 5 minutes.",
    "Our builder is exceptionally easy to use.",
    "For the cost of 1 highly produced video, you can get a year's worth of videos from Automagical."
  ]
}
```

## CLI

```
npm install -g text-summarization
```

This installs a `summarize` binary globally.

```bash
  Usage: summarize [options] <file>

  Options:
    -V, --version              output the version number
    -n, --num-sentences <n>    number of sentences (defaults to variable length)
    -t, --title <title>        title
    -c, --content-type <type>  sets content type to html or text
    -d, --detailed             print detailed info for top sentences
    -D, --detailedAll          print detailed info for all sentences
    -m, --media                resolve <a> links using iframely and return best matching media
    -P, --no-pretty-print      disable pretty-printing output
    -h, --help                 output usage information
```

## Metrics

- tfidf overlap for base relative sentence importance
- html node boosts for tags like `<h1>` and `<strong>`
- listicle boosts for lists like `2) second item`
- penalty for poor readability or really long sentences

Here's an example of a sentence's internal structure after normalization, processing, and scoring:

```js
{
  "index": 8,
  "sentence": {
    "original": "4. For the cost of 1 highly produced video, you can get a year's worth of videos from Automagical.",
    "listItem": 4,
    "actual": "For the cost of 1 highly produced video, you can get a year's worth of videos from Automagical.",
    "normalized": "for the cost of 1 highly produced video you can get a years worth of videos from automagical",
    "tokenized": [
      "cost",
      "highly",
      "produced",
      "video",
      "years",
      "worth",
      "videos",
      "automagical"
    ]
  },
  "liScore": 1,
  "nodeScore": 0.7,
  "readabilityPenalty": 0,
  "tfidfScore": 0.8019447657605553,
  "score": 5.601944765760555
}
```

## Iframely

This module optionally supports using [iframely](https://iframely.com) to get social previews for any external links in the source html, adding the resulting images and summary text to the source pool of candidate sentences.

To enable this, set the `IFRAMELY_BASE_URL` and `IFRAMELY_API_KEY` environment variables.

## References

- [node-summary](https://github.com/jbrooksuk/node-summary)
- [natural nlp](https://github.com/NaturalNode/natural)
- [retext](https://github.com/wooorm/retext)
- [retext-readability](https://github.com/wooorm/retext-readability)
- [retext-simplify](https://github.com/wooorm/retext-simplify)
- [retext-redundant-acronyms](https://github.com/wooorm/retext-redundant-acronyms)
- [retext-repeated-words](https://github.com/wooorm/retext-repeated-words)

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
