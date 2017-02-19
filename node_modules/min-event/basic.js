var _ = require('min-util')
var getorset = require('getorset')

var is = _.is

module.exports = Emitter

function Emitter() {
	if (!(this instanceof Emitter)) return new Emitter
	this.cache = {}
}

function returnTrue() {
	return true
}

var proto = Emitter.prototype

proto.on = function(type, fn) {
	if (is.fn(fn)) {
		var item = {}
		item.handler = fn
		// this.cache.push(item)
		var arr = getorset(this.cache, type, [])
		arr.push(item)
		return item
	}
}

proto.once = function(type, fn) {
	if (is.fn(fn)) {
		var fired
		var me = this
		function wrapper() {
			if (fired) return
			fired = true
			me.off(function(item) {
				return item.handler == wrapper
			})
			wrapper = null
			fn.apply(this, arguments)
		}
		return me.on(type, wrapper)
	}
}

proto.emit = function(type, filter, runner) {
	var filtered = this.filter(type, filter)
	_.each(filtered, runner || basicRunner) // trigger handler in one time
	return filtered
}

proto.off = function(type, filter) {
	if (undefined === type) {
		// remove all cache
		this.cache = {}
	} else {
		_.remove(this.cache[type], filter || returnTrue)
	}
}

proto.filter = function(type, filter) {
	return _.filter(this.cache[type], filter || returnTrue)
}

function basicRunner(item) {
	item.handler()
}

