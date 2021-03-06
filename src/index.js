import * as babylon from 'babylon'
import traverse from 'babel-traverse'
import {
  pathString,
  isParent,
  isChild,
  isCodePoint,
  codeForCodePoint,
  paramForCodePoint,
  isVarDeclaration,
  isIdentifier,
  pointName,
  variableName,
  identifierName,
  isObjectProperty,
  checkIdentifierOfObjectProperty,
  isUsedAsObjectKeyString
} from './utils'
import dumpCode from './dumpCode'
import externalVars from './externalVars'

const header = `/* AUTO-GENERATED BY PUREFUNCS */
/* eslint-disable semi, no-trailing-spaces, max-len, eol-last */

`

export default (inputCode, options = {}) => {
  const defaultBabylonOptions = {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'asyncFunctions',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  }

  const babylonOptions = {...defaultBabylonOptions, ...options}

  const ast = babylon.parse(inputCode, babylonOptions)

  const codePointHeap = []
  let freeVariables = []
  const usedVariables = []

  const result = {}
  let depth = 0
  let topLevelDeclaration = null

  traverse(ast, {
    enter (path) {
      depth++
      if (isCodePoint(path)) {
        const name = pointName(path, topLevelDeclaration)
        codePointHeap.push(name)
        const id = pathString(codePointHeap)
        result[id] = {
          path: id,
          code: codeForCodePoint(inputCode, path),
          params: paramForCodePoint(inputCode, path),
          freeVars: [...freeVariables]
        }
        return
      }
      if (isVarDeclaration(path)) {
        if (depth <= 4) {
          topLevelDeclaration = variableName(path)
        }
        freeVariables.push({
          varName: variableName(path),
          definedIn: pathString(codePointHeap)
        })
        return
      }
      if (isIdentifier(path) && !isUsedAsObjectKeyString(path)) {
        usedVariables.push({
          varName: identifierName(path),
          usedIn: pathString(codePointHeap)
        })
        return
      }
      if (isObjectProperty(path)) {
        checkIdentifierOfObjectProperty(path)
        return
      }
    },
    exit (path) {
      depth--
      if (isCodePoint(path)) {
        const id = pathString(codePointHeap)
        result[id].definedVars = freeVariables.filter(
          ({definedIn}) => isChild(definedIn, id)
        )
        freeVariables = freeVariables.filter(
          ({definedIn}) => isParent(definedIn, id)
        )
        result[id].usedVars = usedVariables.filter(
          ({usedIn}) => isChild(usedIn, id)
        )
        result[id].externalVars = externalVars(
          result[id].freeVars,
          result[id].usedVars,
          result[id].definedVars
        )
        delete result[id].freeVars
        delete result[id].usedVars
        codePointHeap.pop()
      }
    }
  })

  if (options.debug) {
    return result
  }

  return (options.noHeader ? '' : header) + dumpCode(result).join('\n')
}
