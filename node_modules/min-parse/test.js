var assert = require('assert')
var parse = require('./')

var equal = assert.deepEqual

describe('xml', function() {
	it('should ok', function() {
		var xml = parse.xml('<p>xml</p>')
		var ps = xml.getElementsByTagName('p')
		assert(1 == ps.length)
	})
	it('should contains error', function() {
		var xml = parse.xml('-------', function(err, xml) {
			assert(err instanceof Error, 'should error')
		})
	})
})

describe('html', function() {
	it('empty', function() {
		assert(0 == parse.html().length)
		assert(0 == parse.html('').length)
		assert(0 == parse.html(false).length)
		assert(0 == parse.html(100).length)
		assert(0 == parse.html(null).length)
	})
	it('basic', function() {
		var nodes = parse.html('<div></div>')
		assert(1 == nodes.length)
		nodes = parse.html('<div>foo</div>')
		assert(nodes[0].innerHTML, 'foo')
		nodes = parse.html('<div>')
		assert(1 == nodes.length)
		assert('div' == nodes[0].tagName.toLowerCase())
		nodes = parse.html('text')
		assert(1 == nodes.length)
	})
	it('multi', function() {
		var nodes = parse.html('text1<div></div>text2<h1></h1>text3')
		assert(5 == nodes.length)
	})
})

describe('json', function() {
	it('basic', function() {
		equal(parse.json('{}'), {})
		equal(parse.json('{"foo": "bar"}'), {foo: 'bar'})
		assert(100 === parse.json('100'))
		assert(100 === parse.json(100))
		assert(null === parse.json('null'))
		assert(null === parse.json(null))
		equal(parse.json(' {}  '), {})
	})
	it('should error', function(done) {
		try {
			parse.json('---')
		} catch (e) {
			assert(e)
			done()
		}
	})
})
