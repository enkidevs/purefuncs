import test from 'ava'
import 'babel-register'
import purify from '../src/'
import fs from 'fs'

const examples =
  fs.readFileSync('./examples.md', 'utf8')
  .split('##').slice(1)
  .map((block) => {
    const name = block.split('\n')[0].trim();
    const bits = block.split('```');
    return {name, input: bits[1], output: bits[3]}
  })

function noIndent (str) {
  return str.split('\n').map((x) => x.trim()).filter((x) => x.length).join('\n')
}

function check ({name, input, output}) {
  test(name , async t => {
    const pure = purify(input)
    const a = noIndent(pure)
    const b = noIndent(output)
    if (a !== b) {
      console.log(`Expected output in "${name}":\n\n` + pure)
    }
    return t.same(a, b)
  })
}

examples.map(check)
