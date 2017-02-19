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
