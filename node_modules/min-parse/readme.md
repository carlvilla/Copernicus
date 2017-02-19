min-parse
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

XML JSON HTML parser for browser from IE6+

Installation
---

```sh
npm install min-parse
```

Usage
---

```js
var parse = require('min-parse')
parse.xml('<p></p>')
parse.html('<h1></h1>')
parse.json('{}')
```

`parse.json` and `parse.xml` can throw error if invalid

License
---

ISC

[npm-image]: https://img.shields.io/npm/v/min-parse.svg?style=flat-square
[npm-url]: https://npmjs.org/package/min-parse
[travis-image]: https://img.shields.io/travis/chunpu/min-parse.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/min-parse
[downloads-image]: http://img.shields.io/npm/dm/min-parse.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/min-parse
