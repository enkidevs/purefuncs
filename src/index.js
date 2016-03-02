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

  function isCodePoint (path) {
    return path.node.type === 'FunctionDeclaration'
  }

  function isVarDeclaration (path) {
    return path.node.type === 'VariableDeclarator' ||
           path.node.type === 'ImportSpecifier' ||
           path.node.type === 'ImportDefaultSpecifier'
  }

  function isIdentifier (path) {
    return path.node.type === 'Identifier'
  }

  function pointName (path) {
    return path.node.id.name
  }

  function variableName (path) {
    return (path.node.id ||
            path.node.imported ||
            path.node.local).name
  }

  function identifierName (path) {
    return path.node.name
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

  traverse(ast, {
    enter (path) {
      if (isCodePoint(path)) {
        const name = pointName(path)
        codePointHeap.push(name)
        const id = pathString(codePointHeap)
        result[id] = {
          path: id,
          code: inputCode.slice(
            path.node.body.start,
            path.node.body.end
          ),
          params: path.node.params.map(({name}) => name),
          freeVars: freeVariables.slice()
        }
      }
      if (isVarDeclaration(path)) {
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

  function dumpCode (res) {
    return Object.keys(res).map((id) => {
      const r = res[id]
      return `export const ${r.path} = ({${
        r.externalVars.join(', ')
      }}) => (${
        (r.params || []).join(', ')
      }) => ${
        r.code
      }
      `
    })
  }

  if (options.debug) {
    return result
  }

  return dumpCode(result).join('\n')
}
