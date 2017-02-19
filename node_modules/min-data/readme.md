min-data
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/min-data.svg?style=flat-square
[npm-url]: https://npmjs.org/package/min-data
[downloads-image]: http://img.shields.io/npm/dm/min-data.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/min-data
[david-image]: http://img.shields.io/david/chunpu/min-data.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/min-data


Store value for object, jQuery style Data

Installation
---

```sh
npm i min-data
```

Usage
---

```js
var Data = require('min-data')

var data = new Data
var obj = {}

data.set(obj, 'foo', 'bar')
data.get(obj, 'foo') // => 'bar'
data.remove(obj, 'foo')
```

Why should use Data
---

We use jQuery style Data rather than `obj.foo = 'bar'`

Because we can avoid **object Circular Reference**

Then we can `JSON.stringify(obj)` safely

Simple clear all data by `data.remove(obj)`

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/min-data.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/min-data
[license-image]: http://img.shields.io/npm/l/min-data.svg?style=flat-square
[license-url]: #
