## Basic Function Declaration

Input:
```
function f(x) {
  return x;
}
```

Output:
```
export const f = ({}) => (x) => {
  return x;
}
```
## Variable Function Declaration

Input:
```
var f = function (x) {
  return x;
}
```

Output:
```
export const f = ({}) => (x) => {
  return x;
}
```

## Variable Arrow Function Declaration

Input:
```
var f = (x) => {
  return x;
}
```

```
export const f = ({}) => (x) => {
  return x;
}
```

## Variable Arrow Function Declaration, Without Brackets

Input:
```
var f = (x) => x
```

Output:
```
export const f = ({}) => (x) => x
```

## Function Declarations In Object Properties

Input:
```
var o = {
  f(x) {
    return x;
  }
}
```

Output:
```
export const o$f = ({}) => (x) => {
  return x;
}
```

## Nested Functions

Input:
```
function foo(x) {
  function bla(y) {
    return x + y;
  }
}
```

Output:
```
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
```
import {a, b} from 'f1'
import c from 'f2'
const d = require('f3')

function foo(x) {
  return a + b + c + d + x;
}
```

Output:
```
export const foo = ({a, b, c, d}) => (x) => {
  return a + b + c + d + x;
}
```

## Object and Array Arguments Deconstruction

Input:
```
function foo(x, {y}, [z]) {
  return x + y + z;
}
```

Output:
```
export const foo = ({}) => (x, {y}, [z]) => {
  return x + y + z;
}
```
