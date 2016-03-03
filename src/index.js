import * as babylon from 'babylon'
import traverse from 'babel-traverse'

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

  const babylonOptions = Object.assign({}, defaultBabylonOptions, options)

  const ast = babylon.parse(inputCode, babylonOptions)

  const codePointHeap = []
  let freeVariables = []
  const usedVariables = []

  function pathString (_codePointHeap) {
    return _codePointHeap.join('$')
  }

  function isParentPath (pathStr1, pathStr2) {
    return pathStr2.slice(0, pathStr1.length) === pathStr1
  }

  function isCodePoint ({node}) {
    return node.type === 'FunctionDeclaration' ||
           node.type === 'ObjectMethod' ||
          (node.type === 'VariableDeclarator' && (
            node.init.type === 'FunctionExpression' ||
            node.init.type === 'ArrowFunctionExpression'
          ))
  }

  function codeForCodePoint (inputCode, {node}) {
    const body = node.body ||
                 node.init.body
    return inputCode.slice(body.start, body.end)
  }

  function paramForCodePoint (inputCode, {node}) {
    const params = node.params ||
                   node.init.params
    return params.map((p) =>
      inputCode.slice(p.start, p.end)
    )
  }

  function isVarDeclaration ({node}) {
    return node.type === 'VariableDeclarator' ||
           node.type === 'ImportSpecifier' ||
           node.type === 'ImportDefaultSpecifier'
  }

  function isIdentifier ({node}) {
    return node.type === 'Identifier'
  }

  function pointName ({node}, topLevelDeclaration) {
    if (node.type === 'ObjectMethod') {
      return topLevelDeclaration + '$' + node.key.name
    }
    return node.id.name
  }

  function variableName ({node}) {
    return (node.id ||
            node.imported ||
            node.local).name
  }

  function identifierName ({node}) {
    return node.name
  }

  function externalVars (freeVars, usedVars) {
    const used = {}
    usedVars.forEach(
      ({varName}) => { used[varName] = true }
    )
    return freeVars.filter(
      ({varName}) => used[varName]
    ).map(
      ({varName}) => varName
    )
  }

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
          freeVars: freeVariables.slice()
        }
      }
      if (isVarDeclaration(path)) {
        if (depth <= 4) {
          topLevelDeclaration = variableName(path)
        }
        freeVariables.push({
          varName: variableName(path),
          definedIn: pathString(codePointHeap)
        })
      }
      if (isIdentifier(path)) {
        usedVariables.push({
          varName: identifierName(path),
          usedIn: pathString(codePointHeap)
        })
      }
    },
    exit (path) {
      depth--
      if (isCodePoint(path)) {
        const id = pathString(codePointHeap)
        freeVariables = freeVariables.filter(
          ({definedIn}) => isParentPath(definedIn, id)
        )
        result[id].usedVars = usedVariables.filter(
          ({usedIn}) => isParentPath(id, usedIn)
        )
        result[id].externalVars = externalVars(
          result[id].freeVars,
          result[id].usedVars
        )
        delete result[id].freeVars
        delete result[id].usedVars
        codePointHeap.pop()
      }
    }
  })

  function fixIndent (str) {
    const lines = str.split('\n')
    const indent = Math.min.apply({},
      lines.slice(1).map((x) => /^(\s)*/g.exec(x)[0].length)
    )
    return lines[0] + '\n' + lines.slice(1).map(
      (line) => line.slice(indent)
    ).join('\n')
  }

  function dumpCode (res) {
    return Object.keys(res).map((id) => {
      const r = res[id]
      return `export const ${r.path} = ({${
        r.externalVars.join(', ')
      }}) => (${
        (r.params || []).join(', ')
      }) => ${
        fixIndent(r.code)
      }
      `
    })
  }

  if (options.debug) {
    return result
  }

  return dumpCode(result).join('\n')
}
