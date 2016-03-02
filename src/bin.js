#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
import purify from './'

let inputFilename

program
  .arguments('<file>')
  .option('-o, --output <target>', 'output file name')
  .option('-d, --debug', 'debug mode')
  .action(function (x) { inputFilename = x })
  .parse(process.argv)

fs.readFile(inputFilename, 'utf8', (err, data) => {
  if (err) throw err
  const options = {}
  if (program.debug) {
    options.debug = true
  }
  const result = purify(data, options)
  if (!program.output) {
    console.log(result)
  } else {
    fs.writeFile(program.output, result, (err) => {
      if (err) throw err
      console.log('wrote file: \n' + program.output)
    })
  }
})
