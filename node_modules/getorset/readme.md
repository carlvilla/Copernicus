getorset
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/getorset.svg?style=flat-square
[npm-url]: https://npmjs.org/package/getorset
[downloads-image]: http://img.shields.io/npm/dm/getorset.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/getorset
[david-image]: http://img.shields.io/david/chunpu/getorset.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/getorset


Get or Set a value from object

Installation
---

```sh
npm i getorset
```

Usage
---

> `getorset(object, key name[, default value])`

```js
var getorset = require('getorset')

var obj = {
	foo: 'bar'
}

var ret = getorset(obj, 'foo2', [])
console.log(ret.foo2) // => []
```

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/getorset.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/getorset
[license-image]: http://img.shields.io/npm/l/getorset.svg?style=flat-square
[license-url]: #
