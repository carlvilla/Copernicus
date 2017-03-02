'use strict';

function asCallback(promise, cb, options) {
  if (typeof cb !== 'function') return promise

  let p = promise.then(function (ret) {
    if (options && options.spread && Array.isArray(ret)) {
      cb.apply(null, [null].concat(ret))
    } else cb(null, ret)
  }, cb)

  if (typeof p.done === 'function') {
    p.done()
  } else if (typeof setTimeout === 'function') {
    p.catch(asyncThrow)
  }

  return promise
}

function asyncThrow(e) {
  setTimeout(function() {throw e}, 0)
}

module.exports = asCallback
