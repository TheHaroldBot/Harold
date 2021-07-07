# Remove from array

Simply remove an item from an array.

## Installation

```sh
npm install --save remove-from-array
```

## Usage

```js
const removeFromArray = require('remove-from-array')

let array = [1, 2, 3, 4]

removeFromArray(array, 2)
removeFromArray(array, 4)

console.log(array) // [1, 3]
```

## API

### `removeFromArray(array, item)`

Removes the item `item` from the array `array`. Throws a `RangeError` if the item cannot be found.
