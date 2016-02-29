import test from 'ava'
import 'babel-register'
import purify from '../src/'

function noIndent (str) {
  return str.split('\n').map((x) => x.trim()).filter((x) => x.length).join('\n')
}

test('can handle simple example', async t => {

  const input = `
    function foo(x) {
      function bla(y) {
        return x + y;
      }
    }
  `
  const output = `
    export const foo = ({}) => (x) => {
      function bla(y) {
        return x + y;
      }
    }
    export const foo$bla = ({}) => (y) => {
      return x + y;
    }
  `
  t.same(noIndent(purify(input)), noIndent(output))
})
