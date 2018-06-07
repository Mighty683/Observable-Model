const { strictEqual } = require('assert')
const Model = require('../index.js')

let testFun, testFunResult
function PrepareTestFun () {
  testFunResult = {
    called: false
  }
  testFun = function () {
    testFunResult = {
      called: true,
      args: arguments
    }
  }
}
let DoTest = function (callback) {
  PrepareTestFun()
  callback()
}
// Listen/Emit Test
DoTest(function () {
  let model = new Model()
  model.listenTo('event', testFun)
  strictEqual(testFun, model.getEventList()['event'].callback)
  model.emit('event', 2, 2)
  strictEqual(testFunResult.called, true)
})

// Remove listener Test
DoTest(function () {
  let model = new Model()
  model.stopListening('event')
  model.emit('event', 2, 2)
  strictEqual(testFunResult.called, false)
  strictEqual(model.getEventList()['event'], undefined)
})

// Set/Get Test
DoTest(function () {
  let model = new Model({
    'falseValue': false
  })
  model.listenTo('change:value', testFun)
  model.set('value', 1)

  strictEqual(testFunResult.called, true)
  strictEqual(model.get('value'), 1)
  strictEqual(model.get('falseValue'), false)
})

// Unset Test
DoTest(function () {
  let model = new Model()
  model.listenTo('change:value', testFun)
  model.unset('value')
  strictEqual(testFunResult.called, false)
})

// Validation Test
DoTest(function () {
  let model = new Model()
  model.set('value', 3)
  model.listenTo('unvalid:value', testFun)
  model.setValidation('value', function (nextValue, prevValue) {
    return nextValue < prevValue
  })
  model.set('value', 4)

  strictEqual(model.get('value'), 3)

  model.set('value', 2)

  strictEqual(model.get('value'), 2)
  strictEqual(testFunResult.called, true)
  strictEqual(testFunResult.args[0], 4)
})

// Remove Validation Test
DoTest(function () {
  let model = new Model()
  model.set('value', 5)
  model.setValidation('value', function (nextValue, prevValue) {
    return nextValue < prevValue
  })
  model.set('value', 6)

  strictEqual(model.get('value'), 5)

  model.removeValidation('value')

  model.set('value', 4)

  strictEqual(model.get('value'), 4)
})

// Comparator Test
DoTest(function () {
  let model = new Model()
  let testObj = {
    a: 1
  }
  model.set('value', testObj)
  model.setComparator('value', function (nextValue, prevValue) {
    return nextValue.a === prevValue.a
  })
  model.listenTo('change:value', testFun)
  model.set('value', {
    a: 1
  })
  strictEqual(testFunResult.called, false)
  model.set('value', {
    a: 2
  })
  strictEqual(testFunResult.called, true)
})
