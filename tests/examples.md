## Basic Function Declaration

Input:
```js
function f(x) {
  return x;
}
```

Output:
```js
export const f = ({}) => (x) => {
  return x;
}
```
## Variable Function Declaration

Input:
```js
var f = function (x) {
  return x;
}
```

Output:
```js
export const f = ({}) => (x) => {
  return x;
}
```

## Exported Variable Function Declaration

Input:
```js
export const f = function (x) {
  return x;
}
```

Output:
```js
export const f = ({}) => (x) => {
  return x;
}
```


## Variable Arrow Function Declaration

Input:
```js
var f = (x) => {
  return x;
}
```

```js
export const f = ({}) => (x) => {
  return x;
}
```

## Variable Arrow Function Declaration, Without Brackets

Input:
```js
var f = (x) => x
```

Output:
```js
export const f = ({}) => (x) => x
```

## Function Declarations In Object Properties

Input:
```js
var o = {
  f(x) {
    return x;
  }
}
```

Output:
```js
export const o$f = ({}) => (x) => {
  return x;
}
```

## Nested Functions

Input:
```js
function foo(x) {
  function bla(y) {
    return x + y;
  }
}
```

Output:
```js
export const foo = ({}) => (x) => {
  function bla(y) {
    return x + y;
  }
}
export const foo$bla = ({}) => (y) => {
  return x + y;
}
```

## Globals and Modules

Input:
```js
import {a, b} from 'f1'
import c from 'f2'
const d = require('f3')

function foo(x) {
  return a + b + c + d + x;
}
```

Output:
```js
export const foo = ({a, b, c, d}) => (x) => {
  return a + b + c + d + x;
}
```

## Globals and Modules: Including Only Those Actually Used

Input:
```js
import {a, b} from 'f1'
import c from 'f2'
const d = require('f3')

function foo(x) {
  return a + c + x;
}
```

Output:
```js
export const foo = ({a, c}) => (x) => {
  return a + c + x;
}
```

## Object and Array Arguments Deconstruction

Input:
```js
function foo(x, {y}, [z]) {
  return x + y + z;
}
```

Output:
```js
export const foo = ({}) => (x, {y}, [z]) => {
  return x + y + z;
}
```
