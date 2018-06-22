# Observable-Model
Package deliver light-weight model with ability to set-up custom validation and attribute change comparator.
## Usage

```js
let Model = require('observable-model').Model
let model = new Model()
```
## Features
### Setting and Getting Attributes
You can set, get and remove attributes from Model.
```js
model.set('name', value) // 'change:value' event emited
model.get('name') // --> value
```
Changing attribute emits ```'change:${attributeName}'``` event with new value as argument.
Basic comparator is ```===``` operator.
### Comparator
You can set custom compare function for looking for changes
```js
model.setComparator('value', function (nextValue, prevValue) {
    return nextValue.a === prevValue.a
})
  model.set('value', {
    a: 1
  }) // -> emits 'change:value' event
  model.set('value', {
    a: 1
  }) // -> doesn't emit 'change:value' event
  model.set('value', {
    a: 2
  }) // -> emit 'change:value' event
```
```js
model.setComparator('value', _.isEqual) // You can use functions from external libraries.
```

```js
model.removeComparator('value') // Removes Comparator
```
### Validation
```js
model.set('value', 3)
model.setValidation('value', function (nextValue, prevValue) {
  return nextValue < prevValue
})
model.set('value', 4) // -> emits 'unvalid:value' event
model.set('value', 2) // value: 2
model.validate('value', 5) // returns false
model.removeValidation('value') // removes value
model.set('value', 4) // now you are free to set value again
```
Validation on failiture emits ```'unvalid:${attributeName}'``` event with unvalid value as argument.

### Event Driver

More Info: https://www.npmjs.com/package/event-driven-object