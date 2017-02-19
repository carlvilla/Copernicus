var uid = require('muid')

module.exports = Data

function Data() {
	this.expando = uid()
	this.cache = [null]
}

var proto = Data.prototype

proto.get = function(owner, key) {
	var data = this.getData(owner)
	if (null == key) {
		return data
	}
	return data[key]
}

proto.set = function(owner, key, value) {
	var data = this.getData(owner, true)
	data[key] = value
	return owner
}

proto.remove = function(owner, key) {
	if (undefined === key) {
		this.discard(owner)
	} else {
		var data = this.getData(owner)
		delete data[key]
	}
	return owner
}

proto.getData = function(owner, shouldCreate) {
	var data = {}
	if (owner) {
		var count = owner[this.expando]
		var cache = this.cache
		if (count) {
			return cache[count]
		}
		if (shouldCreate) {
			owner[this.expando] = cache.length
			cache.push(data)
		}
	}
	return data
}

proto.discard = function(owner) {
	if (owner && owner[this.expando]) {
		// old IE will crash on element `delete`
		owner[this.expando] = undefined
	}
}
