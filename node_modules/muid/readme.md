muid
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/muid.svg?style=flat-square
[npm-url]: https://npmjs.org/package/muid
[downloads-image]: http://img.shields.io/npm/dm/muid.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/muid
[david-image]: http://img.shields.io/david/chunpu/muid.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/muid


mini unique id generator

Installation
---

```sh
npm i muid
```

Inspired by [uid](https://www.npmjs.com/package/uid)

Usage
---

```js
var uid = require('muid')

uid() => 'damkg3t' // default len is 7
uid(10) => 'sah2aqw9nu'
```

Prefix
---

```
uid.prefix = 'myapp-'
uid() => 'myapp-3n78ceo'
```

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/muid.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/muid
[license-image]: http://img.shields.io/npm/l/muid.svg?style=flat-square
[license-url]: #
