export default function externalVars (freeVars, usedVars, definedVars) {
  const used = usedVars.reduce((prev, {varName}) => ({...prev, [varName]: true}), {})
  const defined = definedVars.reduce((prev, {varName}) => ({...prev, [varName]: true}), {})
  return freeVars.filter(
    ({varName}) => used[varName]
  ).filter(
    ({varName}) => !defined[varName]
  ).map(
    ({varName}) => varName
  )
}
