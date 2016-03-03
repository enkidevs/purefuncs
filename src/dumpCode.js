function fixIndent (str) {
  const lines = str.split('\n')
  const indent = Math.min.apply({},
    lines.slice(1)
      .filter((x) => x.trim().length)
      .map((x) => /^(\s)*/g.exec(x)[0].length)
  )
  return lines[0] + '\n' + lines.slice(1).map(
    (line) => line.slice(indent)
  ).join('\n')
}

export default function dumpCode (res) {
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
