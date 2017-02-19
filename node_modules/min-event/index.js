var _ = require('min-util')
var Emitter = require('./basic')

module.exports = Event

var key = 'emitter'

function Event() {
	if (!(this instanceof Event)) return new Event
	this[key] = new Emitter
}

var proto = Event.prototype

proto.on = function(type, fn) {
	return this[key].on(type, fn)
}

proto.once = function(type, fn) {
	return this[key].once(type, fn)
}

proto.emit = function(type) {
	var args = _.slice(arguments, 1)
	var me = this
	return me[key].emit(type, null, function(item) {
		item.handler.apply(me, args)
	})
}

proto.off = function(type, fn) {
	var filter
	if (fn) {
		filter = function(item) {
			return item.handler == fn
		}
	}
	return this[key].off(type, filter)
}

