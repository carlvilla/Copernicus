// var assert = require('assert')
// var Events = require('../emitter')

/*
describe('node.js style events', function() {
	it('can on and emit', function(done) {
		var e = new Events
		var arr = []
		e.on('one', function(v) {
			arr.push(v)
		})
		e.on('two', function(v1, v2) {
			arr.push(v1, v2)
		})
		e.emit('two', 1, 2)
		e.emit('one', 3)
		assert.deepEqual([1, 2, 3], arr)
		setTimeout(function() {
			assert.deepEqual([1, 2, 3], arr)
			done()
		}, 20)
	})

	it('can remove or remove all', function() {
		var e = new Events
		var arr = []
		function add1() {
			arr.push(1)
		}
		function add2() {
			arr.push(2)
		}
		function add3() {
			arr.push(3)
		}
		e.on('e', add1)
		e.on('e', add2)
		e.on('e', add3)
		e.emit('e')
		assert.deepEqual([1, 2, 3], arr)

		arr = []
		e.removeListener('e', add2)
		e.emit('e')
		assert.deepEqual([1, 3], arr)

		arr = []
		e.removeAllListeners('e')
		e.emit('e')
		assert.deepEqual([], arr)
		e.on('e', add1)
		e.on('e', add2)
		e.on('e', add3)
		e.emit('e')
		assert.deepEqual([1, 2, 3], arr)
		e.off('e')
		e.emit('e')
		assert.deepEqual([1, 2, 3], arr)
	})

	it('support once', function(done) {
		var e = new Events
		var arr = []
		e.once('once', function() {
			arr.push(1)
		})
		e.emit('once')
		e.emit('once')
		e.emit('once')
		assert.deepEqual([1], arr)
		setTimeout(function() {
			assert.deepEqual([1], arr)
			done()
		}, 20)
	})
})
*/
