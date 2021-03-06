import test from 'ava'
import 'babel-register'
import purify from '../src/'
import fs from 'fs'

const examples =
  fs.readFileSync('./examples.md', 'utf8')
  .split('##').slice(1)
  .map((block) => {
    const name = block.split('\n')[0].trim()
    const bits = block.split('```')
    const input = bits[1].replace(/^js/, '')
    const output = (bits[5] || bits[3]).replace(/^js/, '')
    return {name, input, output}
  })

function noIndent (str) {
  return str.split('\n').map((x) => x.trim()).filter((x) => x.length).join('\n')
}

function check ({name, input, output}) {
  test(name, async t => {
    const pure = purify(input, {noHeader: true})
    const a = noIndent(pure)
    const b = noIndent(output)
    if (a !== b) {
      console.log(`Expected output in "${name}":\n\n` + pure)
    }
    return t.same(a, b)
  })
}

examples.map(check)
