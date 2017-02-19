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
