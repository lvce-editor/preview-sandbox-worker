import { parse } from '@babel/parser'

const getPatternNames = (pattern: any): readonly string[] => {
  if (pattern.type === 'Identifier') {
    return [pattern.name]
  }
  if (pattern.type === 'RestElement') {
    return getPatternNames(pattern.argument)
  }
  if (pattern.type === 'AssignmentPattern') {
    return getPatternNames(pattern.left)
  }
  if (pattern.type === 'ArrayPattern') {
    return pattern.elements.flatMap((element: any) => {
      if (!element) {
        return []
      }
      return getPatternNames(element)
    })
  }
  if (pattern.type === 'ObjectPattern') {
    return pattern.properties.flatMap((property: any) => {
      if (property.type === 'RestElement') {
        return getPatternNames(property.argument)
      }
      return getPatternNames(property.value)
    })
  }
  return []
}

export const getTopLevelVariableNames = (script: string): readonly string[] => {
  try {
    const ast = parse(script, {
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
      errorRecovery: true,
      sourceType: 'script',
    })
    const names: string[] = []
    for (const statement of ast.program.body) {
      if (statement.type !== 'VariableDeclaration' || statement.kind !== 'var') {
        continue
      }
      for (const declaration of statement.declarations) {
        names.push(...getPatternNames(declaration.id))
      }
    }
    return names
  } catch {
    return []
  }
}
