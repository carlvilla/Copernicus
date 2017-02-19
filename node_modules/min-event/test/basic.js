var assert = require('assert')
var Emitter = require('../basic')

describe('basic', function() {
	it('can on & emit', function(done) {
		var emitter = Emitter()
		var arr = []
		function returnTrue() {
			return true
		}
		var i = 1

		emitter.on('', function(e) {
			arr.push(i++)
		})
		emitter.emit('', returnTrue)
		emitter.emit('', returnTrue)
		emitter.emit('', returnTrue)
		assert.deepEqual([1, 2, 3], arr)
		setTimeout(function() {
			assert.deepEqual([1, 2, 3], arr)
			done()
		}, 10)
	})

	it('can remove or remove all', function() {
		var e = new Emitter
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
		e.off('e', function(item) {
			return item.handler == add2
		})
		e.emit('e')
		assert.deepEqual([1, 3], arr)

		arr = []
		e.off('e')
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

	it('can remove all events', function() {
		var e = new Emitter
		var arr = []
		e.on('e1', function() {
			arr.push(1)
		})
		e.on('e2', function() {
			arr.push(2)
		})
		e.emit('e1')
		e.emit('e2')
		e.off()
		e.emit('e1')
		e.emit('e2')
		assert.deepEqual(arr, [1, 2])
	})

	it('support once', function(done) {
		var e = new Emitter
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
