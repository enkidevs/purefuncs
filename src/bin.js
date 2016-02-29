#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
import purify from './'

console.log(purify)

let inputFilename

program
  .arguments('<file>')
  .option('-o, --output <target>', 'output file name')
  .action(function (x) { inputFilename = x })
  .parse(process.argv)

fs.readFile(inputFilename, 'utf8', (err, data) => {
  if (err) throw err
  const result = purify(data)
  if (!program.output) {
    console.log(result)
  } else {
    fs.writeFile(program.output, result, (err) => {
      if (err) throw err
      console.log('wrote file: \n' + program.output)
    })
  }
})
