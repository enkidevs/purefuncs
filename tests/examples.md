# Working Examples

Below is a list of *tested* examples of inputs and output.

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

## Variables re-defined locally should be ignored

Input:
```js
var a = 1;
function f(x) {
  var a = 2;
  return {a, x}
}
```

Output:
```js
export const f = ({}) => (x) => {
  var a = 2;
  return {a, x}
}
```

## Preserve defaults

Input:
```js
function f(x = 1) {
  return {x}
}
```

Output:
```js
export const f = ({}) => (x = 1) => {
  return {x}
}
```

## Object properties are sometimes confused with used variables

Input:
```js
var a = 1;
function f(x) {
  return {a: 3, x}
}
```

Output:
```js
export const f = ({}) => (x) => {
  return {a: 3, x}
}
```

# Not Working Yet!

Below is a list of examples of inputs for which the output is not
yet the desired one.
