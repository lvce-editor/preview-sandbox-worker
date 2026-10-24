import { parse } from '@babel/parser'
import { cacheScriptAnalysis } from '../CacheScriptAnalysis/CacheScriptAnalysis.ts'

interface ScriptAnalysis {
  readonly canvasCreationCount: number
  readonly topLevelVariableNames: readonly string[]
}

const isCanvasLiteral = (node: any): boolean => {
  return node?.type === 'StringLiteral' && node.value.toLowerCase() === 'canvas'
}

const isDocumentMethod = (node: any, methodName: string): boolean => {
  if (node?.type !== 'MemberExpression' || node.computed) {
    return false
  }
  return (
    node.object?.type === 'Identifier' && node.object.name === 'document' && node.property?.type === 'Identifier' && node.property.name === methodName
  )
}

const isCanvasCreation = (node: any): boolean => {
  if (node?.type !== 'CallExpression') {
    return false
  }
  if (isDocumentMethod(node.callee, 'createElement')) {
    return isCanvasLiteral(node.arguments[0])
  }
  if (isDocumentMethod(node.callee, 'createElementNS')) {
    return isCanvasLiteral(node.arguments[1])
  }
  return false
}

const visit = (value: any): number => {
  if (!value || typeof value !== 'object') {
    return 0
  }
  if (Array.isArray(value)) {
    let count = 0
    for (const child of value) {
      count += visit(child)
    }
    return count
  }
  // Parser locations and extra metadata are not syntax nodes.
  if (typeof value.type !== 'string') return 0
  let count = isCanvasCreation(value) ? 1 : 0
  for (const child of Object.values(value)) {
    count += visit(child)
  }
  return count
}

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

// Canvas reservation and script execution need the same parse. Cache only the
// small summary, so neither analysis retains the library's parser AST.
export const createScriptAnalyzer = (parseScript: typeof parse = parse): ((script: string) => ScriptAnalysis) => {
  return cacheScriptAnalysis((script: string): ScriptAnalysis => {
    try {
      const ast = parseScript(script, {
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        errorRecovery: true,
        sourceType: 'script',
      })
      const topLevelVariableNames: string[] = []
      for (const statement of ast.program.body) {
        if (statement.type !== 'VariableDeclaration' || statement.kind !== 'var') continue
        for (const declaration of statement.declarations) {
          topLevelVariableNames.push(...getPatternNames(declaration.id))
        }
      }
      return { canvasCreationCount: visit(ast), topLevelVariableNames }
    } catch {
      return { canvasCreationCount: 0, topLevelVariableNames: [] }
    }
  })
}

export const analyzeScript = createScriptAnalyzer()
