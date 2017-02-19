var assert = require('assert')
var Data = require('./')

describe('data', function() {
	it('can set get remove value for object', function() {
		var data = new Data
		var obj = {}

		assert(undefined === data.get(obj, 'foo'))

		assert(obj == data.set(obj, 'foo', 'bar'))

		assert.equal('bar', data.get(obj, 'foo'))

		data.set(obj, 'foo2', 'bar2')

		assert.equal('bar', data.get(obj, 'foo'))

		assert.equal('bar2', data.get(obj, 'foo2'))

		assert(obj == data.remove(obj, 'foo'))	

		assert(undefined === data.get(obj, 'foo'))

		var obj2 = {}

		assert(undefined === data.get(obj2, 'foo'))

		assert(obj2 == data.set(obj2, 'foo', 'bar'))

		assert.equal('bar', data.get(obj2, 'foo'))

		data.set(obj2, 'foo2', 'bar2')

		assert.equal('bar', data.get(obj2, 'foo'))

		assert.equal('bar2', data.get(obj2, 'foo2'))

		assert(obj2 == data.remove(obj2, 'foo'))	

		assert(undefined === data.get(obj2, 'foo'))
	
		// obj still exist
		assert.equal('bar2', data.get(obj, 'foo2'))
	})

	it('will not crash when meet shit', function() {
		var data = new Data
		assert(null === data.set(null, 'foo', 'bar'))
		assert(undefined === data.get(null, 'foo'))
		assert(null === data.remove(null, 'foo'))
	})

	it('can get or remove all', function() {
		var data = new Data
		var obj = {}
		data.set(obj, 'foo', 1)
		data.set(obj, 'foo2', 2)
		data.set(obj, 'foo3', 3)
		assert.deepEqual({
			foo: 1,
			foo2: 2,
			foo3: 3
		}, data.get(obj))
		assert(2 == data.get(obj, 'foo2'))
		data.remove(obj)
		assert(undefined === data.get(obj, 'foo2'))
	})

})
