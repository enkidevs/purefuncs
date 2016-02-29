
# WORK IN PROGRESS - DO NOT USE YET

# Purefuncs

[![build](https://travis-ci.org/enkidevs/purefuncs.svg)](https://travis-ci.org/enkidevs/purefuncs)
[![dependencies](https://david-dm.org/enkidevs/purefuncs.svg)](https://david-dm.org/enkidevs/purefuncs)
[![devDependencies](https://david-dm.org/enkidevs/purefuncs/dev-status.svg)](https://david-dm.org/enkidevs/purefuncs#info=devDependencies)

[![license](https://img.shields.io/npm/l/purefuncs.svg?style=flat-square)](https://www.npmjs.com/package/purefuncs)
[![npm version](https://img.shields.io/npm/v/purefuncs.svg?style=flat-square)](https://www.npmjs.com/package/purefuncs)
[![npm downloads](https://img.shields.io/npm/dm/purefuncs.svg?style=flat-square)](https://www.npmjs.com/package/purefuncs)

Automatically extract pure functions from your javascript code for unit testing.

## Installation

```bash
  npm install --save purefuncs
```

## cli usage

Given:

```javascript
// file: src/example.js
import {asd, boo} from 'asd'
import math from 'somewhere'
const z = 2;
function foo() {
  const x = 3 + z;
  function bla() {
    const f = 5 + asd;
    return x + 1;
  }
  function tada() {
    return x + math.sin(x);
  }
}
```

Run :
```bash
$ purefuncs src/example.js -o test/purefuncs/example.js
```

Output:
```javascript
// file: test/purefuncs/example.js
export const foo = ({asd, math, z}) => () => {
  const x = 3 + z;
  function bla() {
    const f = 5 + asd;
    return x + 1;
  }
  function tada() {
    return x + math.sin(x);
  }
}

export const foo$bla = ({asd, x}) => () => {
  const f = 5 + asd;
  return x + 1;
}

export const foo$tada = ({math, x}) => () => {
  return x + math.sin(x);
}
```

## License

  MIT
