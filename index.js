EventEmiter.prototype.on = function (eventName, callback) {
  this._events[eventName] = {
    callback: callback
  }
}

EventEmiter.prototype.off = function (eventName) {
  if (this._events[eventName]) {
    delete this._events[eventName]
  }
}

EventEmiter.prototype.emit = function (eventName) {
  if (this._events[eventName] && this._events[eventName].callback instanceof Function) {
    this._events[eventName].callback.apply(this, Array.from(arguments).slice(1))
  }
}

EventEmiter.prototype.getEventList = function () {
  return this._events
}

function EventEmiter () {
  this._events = {}
}

Model.prototype = Object.create(EventEmiter.prototype)

Model.prototype.setValidation = function (attrName, callback) {
  this._validations[attrName] = callback
}

Model.prototype.removeValidation = function (attrName) {
  delete this._validations[attrName]
}

Model.prototype.setComp = function (attrName, callback) {
  this._comparators[attrName] = callback
}

Model.prototype.removeComparator = function (attrName) {
  delete this._comparators[attrName]
}

Model.prototype.validate = function (attrName, nextVal) {
  if (this._validations && this._validations[attrName] instanceof Function) {
    return this._validations[attrName](nextVal, this.get('value'))
  } else {
    return false
  }
}

Model.prototype.unset = function (attr) {
  if (typeof attr === 'string') {
    this._unset(attr)
  } else if (typeof attr === 'object') {
    Object.keys(attr).forEach(function (key) {
      this._unset(key)
    }.bind(this))
  }
}
Model.prototype._unset = function (attrName) {
  if (this._attributes[attrName]) {
    delete this._attributes[attrName]
    this.emit('change:' + attrName)
  }
}
Model.prototype.set = function (attr, value) {
  if (typeof attr === 'string') {
    this._setAttr(attr, value)
  } else if (typeof attr === 'object') {
    Object.keys(attr).forEach(function (key) {
      this._setAttr(key, attr[key])
    }.bind(this))
  }
}

Model.prototype._setAttr = function (attrName, value) {
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

Model.prototype.get = function (attrName) {
  return this._attributes[attrName]
}

Model.prototype._compare = function (attrName, value) {
  if (this._comparators[attrName]) {
    return this._comparators[attrName](value, this.get(attrName))
  } else {
    return value === this.get(attrName)
  }
}

Model.prototype.changeValue = function (attrName, value) {
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

function Model (attrsOptions) {
  EventEmiter.call(this)
  this._attributes = attrsOptions || {}
  this._validations = {}
  this._comparators = {}
}

module.exports = Model
