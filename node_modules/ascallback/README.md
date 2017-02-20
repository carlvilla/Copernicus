# asCallback

Use `bluebird`'s [`promise.asCallback(callback)`](http://bluebirdjs.com/docs/api/ascallback.html) (aka `.nodeify`) method as a function to convert non-bluebird promises to node style callbacks.

## Installation

```bash
$ npm install asCallback
```

## Usage

### Functional

Call `asCallback` directly passing the `promise`, `callback` and an optional `options` argument.

```javascript
var asCallback = require('ascallback')

function myAsyncMethod(arg, callback) {
  return asCallback(myPromiseMethod(arg), callback)
}
```

See the [bluebird's `.asCallback` docs](http://bluebirdjs.com/docs/api/ascallback.html) for full feature set and supported options like [`"spread"`](http://bluebirdjs.com/docs/api/ascallback.html#option-spread).
