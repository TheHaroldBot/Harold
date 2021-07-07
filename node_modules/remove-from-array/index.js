'use strict'

module.exports = function removeFromArray (array, item) {
  var idx = array.indexOf(item)

  if (idx === -1) {
    throw new RangeError('Item ' + item + ' was not found in array')
  }

  array.splice(idx, 1)
}
