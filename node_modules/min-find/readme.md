min-find
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/min-find.svg?style=flat-square
[npm-url]: https://npmjs.org/package/min-find
[downloads-image]: http://img.shields.io/npm/dm/min-find.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/min-find
[david-image]: http://img.shields.io/david/chunpu/min-find.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/min-find


simple Sizzle like query selector

Installation
---

```sh
npm i min-find
```

Usage
---

```js
var find = require('min-find')
var elements = find(selector [, containerElement])
```

always return node list in array type


Support
---

- **id** `find('#id')`
- **tag** `find('#h1')`
- **css query** `find('div > h1, div > h2')`

> css query use `element.querySelectorAll`


Custom
---

You can custom the css query by self, if your browser has no query selector like IE8-

e.g.

```js
find.custom = Sizzle
```

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/min-find.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/min-find
[license-image]: http://img.shields.io/npm/l/min-find.svg?style=flat-square
[license-url]: #
