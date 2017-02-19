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
