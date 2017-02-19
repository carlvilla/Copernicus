var assert = require('assert')
var Emitter = require('../')

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
		e.off('e', add2)
		e.emit('e')
		assert.deepEqual([1, 3], arr)

		arr = []
		e.off('e')
		e.emit('e')
		assert.deepEqual(arr, [])



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

	it('can pass data and this', function() {
		var e = new Emitter
		var arr = []
		e.on('e', function(a, b, c) {
			assert(this === e)
			assert(3 == arguments.length)
			arr.push(a, b, c)
		})

		e.emit('e', 2, 4, 6)

		assert.deepEqual(arr, [2, 4, 6])
	})
})
