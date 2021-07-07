'use strict'

var assert = require('assert')
var removeFromArray = require('.')

var array = [1, 2, 3, 4]

removeFromArray(array, 3)
assert.deepEqual(array, [1, 2, 4])

removeFromArray(array, 2)
assert.deepEqual(array, [1, 4])

removeFromArray(array, 1)
assert.deepEqual(array, [4])

assert.throws(function () {
  removeFromArray(array, 10)
}, RangeError)

assert.deepEqual(array, [4])

removeFromArray(array, 4)
assert.deepEqual(array, [])

assert.throws(function () {
  removeFromArray(array, 1)
}, RangeError)

assert.deepEqual(array, [])
