var assert = require('assert')
var find = require('./')

var body = document.body
var canSelector = !!document.querySelectorAll

describe('empty and false', function() {
	it('should always return empty', function() {
		assert(find('').length == 0)
		assert(find().length == 0)
		assert(find(null).length == 0)
		assert(find('#').length == 0)
		assert(find(0).length == 0)
		assert(find(assert).length == 0)
		assert(find([]).length == 0)
	})
})

describe('tag', function() {
	var empty = document.createElement('div')
	it('can get body', function() {
		var arr = find('body')
		assert(arr.length == 1)
		assert(body == arr[0])
		body.appendChild(empty)
	})
	it('can find multi', function() {
		var box = document.createElement('div')
		box.innerHTML = '<h1>h1</h1> <h1>h1</h1> <h1>h1</h1> <h1>h1</h1>'
		body.appendChild(box)
		assert(find('h1').length >= 4)
		assert(find('h1', box).length >= 4)
		assert(0 == find('h1', empty).length)
	})
})

describe('id', function() {
	it('can find #body', function() {
		assert(find('#body').length == 0)
		body.id = 'body'
		assert(find('#body').length == 1)
	})
})

describe('css seletor', function() {
	console.log('can selector', canSelector)
	var div = document.createElement('div')
	div.id = 'div'
	div.innerHTML = '<h2>h2</h2> <h2 class="h2">h2</h2> <h2>h2</h2> <h2>h2</h2>'
	body.appendChild(div)
	if (canSelector) {
		it('can use query', function() {
			assert(find('#div', body).length == 1)
			assert(find('.h2').length == 1)
			assert(find('.h2', body).length == 1)
			assert(find('.h2', div).length == 1)
			assert(find('h2', div).length >= 4)
			assert(find('h1,h2', div).length >= 4)
		})
	} else {
		it('cannot use query', function() {
			assert(find('#div', body).length == 0)
			assert(find('h1,h2', body).length == 0)
		})
	}
})

describe('custom query', function() {
	it('should return custom thing', function() {
		var selector = 'foo bar'
		find.custom = function(selector, box) {
			return [selector, box]
		}
		var arr = find(selector)
		assert.deepEqual(arr, [selector, document])
		find.custom = null
	})
})
