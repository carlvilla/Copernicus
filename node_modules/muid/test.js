var muid = require('./')
var assert = require('assert')

assert(muid().length == 7)

assert(muid(8).length == 8)

assert(muid() != muid())

muid.prefix = 'prefix'

assert(muid().indexOf('prefix') == 0)

console.log('tests pass!')
