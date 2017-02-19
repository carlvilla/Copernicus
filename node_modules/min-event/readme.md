min-event
===

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/min-event.svg?style=flat-square
[npm-url]: https://npmjs.org/package/min-event
[downloads-image]: http://img.shields.io/npm/dm/min-event.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/min-event
[david-image]: http://img.shields.io/david/chunpu/min-event.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/min-event


Basic Event Lib

Installation
---

```sh
npm i min-event
```

Usage
---

```js
var Emitter = require('min-event')

var emitter = new Emitter
```

Basic event lib, if you are confused, see <example/events.js> just like the node.js style events based on `min-event`

Proto Api
---

#### on

Accept one function argument, return a object `{handler: listener}`

```js
var event = emitter.on(listener)
```


#### off

Accept one function argument, remove events filtered by filter

```js
emitter.off(filter)

// e.g.

emitter.off(function(event) {
	return event.type = 'event-type'
})
```


#### emit

Accept two function arguments, filter events and run events

```js
emitter.emit(filter, runner)

// e.g.
emiter.emit(function(event) {
	return event.type = 'mytype'
}, function(event) {
	event.handler() // run the handler, it is absent runner
})
```

License
---

[![License][license-image]][license-url]

[travis-image]: https://img.shields.io/travis/chunpu/min-event.svg?style=flat-square
[travis-url]: https://travis-ci.org/chunpu/min-event
[license-image]: http://img.shields.io/npm/l/min-event.svg?style=flat-square
[license-url]: #
