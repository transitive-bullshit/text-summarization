'use strict'

const test = require('ava')
const shorten = require('./shorten-text-abstractive')

const cases = [
  {
    input: 'You can utilize a shorter word.',
    output: 'You can use a shorter word.'
  },
  {
    input: 'Be advised, don’t lose your ISBN number.',
    output: 'Don’t lose your ISBN.'
  },
  {
    input: 'A number of appropriate edits by virtue of arcraft. On the other hand, one particular kitten resides with respect to cuteness.',
    output: 'Many proper edits by arcraft. But, one kitten resides about cuteness.'
  },
  {
    input: 'today is is the day to clean your LCD display',
    output: 'today is the day to clean your LCD'
  },
  {
    input: 'go to the ATM machine and take the SAT test.',
    output: 'go to the ATM and take the SAT.'
  },
  {
    input: 'And the NYT is not the type of publication that goes to print based on one or two accusations.',
    output: 'And the NYT is not the type of publication that goes to print based on one or two accusations.'
  }
]

cases.forEach(({ input, output }) => {
  test(`"${input}"`, async (t) => {
    const result = await shorten(input)
    t.deepEqual(result, output)
  })
})
