# Observable-Model
Package deliver light-weight model with ability to set-up custom validation and attribute change comparator.
## Usage

```js
let Model = require('observable-model')
let model = new Model()
```
## Features
### Setting and Getting Attributes
You can set, get and remove attributes from Model.
```js
model.set('name', value) // 'change:value' event triggered
model.get('name') // --> value
```
You can set multiple attributes by passing object.
```js
model.set({name: 'name', value: 1})
model.get('name') // --> name
model.get('value') // --> 1
```
Changing attribute triggers ```'change:${attributeName}'``` event with new value as argument.
Basic comparator is ```===``` operator.
### Comparator
You can set custom compare function for looking for changes
```js
model.setComparator('value', function (nextValue, prevValue) {
    return nextValue.a === prevValue.a
})
  model.set('value', {
    a: 1
  }) // -> triggers 'change:value' event
  model.set('value', {
    a: 1
  }) // -> doesn't trigger 'change:value' event
  model.set('value', {
    a: 2
  }) // -> trigger 'change:value' event
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
model.set('value', 4) // -> triggers 'unvalid:value' event
model.set('value', 2) // value: 2
model.validate('value', 5) // returns false
model.removeValidation('value') // removes value validation
model.set('value', 4) // now you are free to set value again
```
Validation on failiture triggers ```'unvalid:${attributeName}'``` event with unvalid value as argument.

### Event Driver
You can add/remove custom events
```js
model.listenTo('eventName', callback) // Subscribe to event with callback
```
```js
model.stopListening('eventName') // Unsubscribe event listener
```
```js
model.trigger('eventName', ...args) // Trigger event
```