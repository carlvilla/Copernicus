// nodejs style events
// https://github.com/iojs/io.js/blob/master/lib/events.js

var Emitter = require('../')
var _ = require('min-util')

var is = _.is

module.exports = EventEmitter

function EventEmitter() {
	this.emitter = new Emitter
}

var proto = EventEmitter.prototype

proto.emit = function(type) {
	var args = _.slice(arguments, 1)
	var me = this
	this.emitter.emit(typeFilter(type), function(item) {
		item.handler.apply(me, args)
	})
	return this
}

proto.on = proto.addListener = function(type, listener) {
	if (is.fn(listener)) {
		var item = this.emitter.on(listener)
		item.type = type
	}
	return this
}

proto.once = function(type, listener) {
	if (is.fn(listener)) {
		var item = this.emitter.once(listener)
		item.type = type
	}
	return this
}

proto.off = function(type, listener) {
	if (listener) return this.removeListener(type, listener)
	return this.removeAllListeners(type)
}

proto.removeListener = function(type, listener) {
	if (is.fn(listener)) {
		this.emitter.off(function(item) {
			if (item.type == type && listener == item.handler)
				return true
		})
	}
	return this
}

proto.removeAllListeners = function(type) {
	this.emitter.off(typeFilter(type))
}

function typeFilter(type) {
	return function(item) {
		return item.type == type
	}
}
