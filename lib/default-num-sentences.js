'use strict'

module.exports = (n) => {
  // vary summary length based on length of source article
  if (n < 8) return Math.min(n, 3)
  if (n < 13) return 4
  if (n < 25) return 5
  if (n < 30) return 6
  if (n < 42) return 7
  if (n < 64) return 8
  if (n < 90) return 9

  return 10
}
