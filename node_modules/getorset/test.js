var getorset = require('./')
var assert = require('assert')

describe('getorset', function() {
	it('should return key haven', function() {
		assert.equal('bar', getorset({foo: 'bar'}, 'foo', []))
		assert.equal('', getorset({foo: ''}, 'foo', []))
	})

	it('should create a object', function() {
		assert.deepEqual({}, getorset({foo: null}, 'foo'))
		assert.deepEqual({}, getorset({}, 'foo'))
		assert.deepEqual({}, getorset({foo: 'bar'}, 'oof'))
	})

	it('should create by the ret value', function() {
		assert.deepEqual([], getorset({foo: 'bar'}, 'oof', []))
	})

	it('should not crash when meet shit', function() {
		assert.deepEqual([], getorset(null, 'foo', []))
	})

	it('should not crash when meet shit', function() {
		assert.deepEqual({}, getorset(null))
	})

})
