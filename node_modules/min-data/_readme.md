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
