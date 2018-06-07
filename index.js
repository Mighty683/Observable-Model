function EventEmiter () {
  this._events = {}
  this.listenTo = function (eventName, callback) {
    this._events[eventName] = {
      callback: callback
    }
  }

  this.stopListening = function (eventName) {
    if (this._events[eventName]) {
      delete this._events[eventName]
    }
  }

  this.emit = function (eventName) {
    if (this._events[eventName] && this._events[eventName].callback instanceof Function) {
      this._events[eventName].callback.apply(this, Array.from(arguments).slice(1))
    }
  }

  this.getEventList = function () {
    return this._events
  }
}
function Model (attrsOptions) {
  EventEmiter.call(this)
  this._attributes = attrsOptions || {}
  this._validations = {}
  this._comparators = {}

  this.setValidation = function (attrName, callback) {
    this._validations[attrName] = callback
  }

  this.removeValidation = function (attrName) {
    delete this._validations[attrName]
  }

  this.setComparator = function (attrName, callback) {
    this._comparators[attrName] = callback
  }

  this.removeComparator = function (attrName) {
    delete this._comparators[attrName]
  }

  this.validate = function (attrName, nextVal) {
    if (this._validations && this._validations[attrName] instanceof Function) {
      return this._validations[attrName](nextVal, this.get('value'))
    } else {
      return false
    }
  }

  this.unset = function (attrName, value) {
    if (this._attributes[attrName]) {
      delete this._attributes[attrName]
      this.emit('change:' + attrName)
    }
  }
  this.set = function (attrName, value) {
    if (this._validations[attrName]) {
      if (this.validate(attrName, value)) {
        this.changeValue(attrName, value)
      } else {
        this.emit('unvalid:' + attrName, value)
      }
    } else {
      this.changeValue(attrName, value)
    }
  }

  this.get = function (attrName) {
    return this._attributes[attrName]
  }

  this._compare = function (attrName, value) {
    if (this._comparators[attrName]) {
      return this._comparators[attrName](value, this.get(attrName))
    } else {
      return value === this.get(attrName)
    }
  }

  this.changeValue = function (attrName, value) {
    if (this.get(attrName)) {
      if (!this._compare(attrName, value)) {
        this._attributes[attrName] = value
        this.emit('change:' + attrName, value)
      }
    } else {
      this._attributes[attrName] = value
      this.emit('change:' + attrName, value)
    }
  }
}

module.exports = Model
