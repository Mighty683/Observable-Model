const { strictEqual } = require('assert')
const Model = require('../index.js')

let testFun, testFunResult
function PrepareTestFun () {
  testFunResult = {
    called: false,
    args: undefined
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

// Set/Get Test
DoTest(function () {
  let model = new Model({
    'falseValue': false
  })
  model.on('change:value', testFun)
  model.set('value', 1)

  strictEqual(testFunResult.called, true)
  strictEqual(model.get('value'), 1)
  strictEqual(model.get('falseValue'), false)
})

DoTest(function () {
  let model = new Model()
  model.on('change:value', testFun)
  model.set({
    value: 1,
    value1: 2
  })

  strictEqual(testFunResult.called, true)
  strictEqual(model.get('value'), 1)
  strictEqual(model.get('value1'), 2)
})

// Unset Test
DoTest(function () {
  let model = new Model({
    value: 1
  })
  model.on('change:value', testFun)
  model.unset('value')
  strictEqual(testFunResult.called, true)
  strictEqual(model.get('value'), undefined)
})

DoTest(function () {
  let model = new Model()
  model.on('change:value', testFun)
  model.unset('value')
  strictEqual(testFunResult.called, false)
})

DoTest(function () {
  let model = new Model()
  model.set({
    value: 1,
    value1: 2,
    value2: 3
  })
  model.unset({
    value: 1,
    value1: 2
  })
  strictEqual(model.get('value'), undefined)
  strictEqual(model.get('value2'), 3)
})

// Validation Test
DoTest(function () {
  let model = new Model()
  model.set('value', 3)
  model.on('unvalid:value', testFun)
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
  model.set('value', {
    a: 1
  })
  model.setComp('value', function (nextValue, prevValue) {
    return nextValue.a === prevValue.a
  })
  model.on('change:value', testFun)
  model.set('value', {
    a: 1
  })
  strictEqual(testFunResult.called, false)
  model.set('value', {
    a: 2
  })
  strictEqual(testFunResult.called, true)
})

// Remove Comparator Test
DoTest(function () {
  let model = new Model()
  model.set('value', {
    a: 1
  })
  model.setComp('value', function (nextValue, prevValue) {
    return nextValue.a === prevValue.a
  })
  model.set('value', {
    a: 2
  })
  strictEqual(testFunResult.called, false)
  model.removeComparator('value')
  model.on('change:value', testFun)
  model.set('value', {
    a: 1
  })
  strictEqual(testFunResult.called, true)
})
