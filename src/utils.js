export function pathString (_codePointHeap) {
  return _codePointHeap.join('$')
}

export function isParent (pathStr1, pathStr2) {
  return !!pathStr2 && pathStr1.slice(0, pathStr2.length) === pathStr2
}

export function isChild (pathStr1, pathStr2) {
  return isParent(pathStr2, pathStr1)
}

export function isCodePoint ({node}) {
  return node.type === 'FunctionDeclaration' ||
         node.type === 'ObjectMethod' ||
        (node.type === 'VariableDeclarator' && (
          node.init.type === 'FunctionExpression' ||
          node.init.type === 'ArrowFunctionExpression'
        ))
}

export function codeForCodePoint (inputCode, {node}) {
  const body = node.body ||
               node.init.body
  return inputCode.slice(body.start, body.end)
}

export function paramForCodePoint (inputCode, {node}) {
  const params = node.params ||
                 node.init.params
  return params.map((p) =>
    inputCode.slice(p.start, p.end)
  )
}

export function isVarDeclaration ({node}) {
  return node.type === 'VariableDeclarator' ||
         node.type === 'ImportSpecifier' ||
         node.type === 'ImportDefaultSpecifier'
}

export function isIdentifier ({node}) {
  return node.type === 'Identifier'
}

export function isObjectProperty ({node}) {
  return node.type === 'ObjectProperty'
}

export function checkIdentifierOfObjectProperty ({node}) {
  if (!node.shorthand && !node.computed && isIdentifier({node: node.key})) {
    node.key.isNotReallyAnIdentifier = true
  }
}

export function isNotReallyAnIdentifier ({node}) {
  return node.isNotReallyAnIdentifier
}

export function pointName ({node}, topLevelDeclaration) {
  if (node.type === 'ObjectMethod') {
    return topLevelDeclaration + '$' + node.key.name
  }
  return node.id.name
}

export function variableName ({node}) {
  return (node.id ||
          node.imported ||
          node.local).name
}

export function identifierName ({node}) {
  return node.name
}
