import { parse } from '@babel/parser'

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
  let count = isCanvasCreation(value) ? 1 : 0
  for (const child of Object.values(value)) {
    count += visit(child)
  }
  return count
}

const getScriptCanvasCreationCount = (script: string): number => {
  try {
    const ast = parse(script, {
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
      errorRecovery: true,
      sourceType: 'script',
    })
    return visit(ast)
  } catch {
    return 0
  }
}

export const getCanvasCreationCount = (scripts: readonly string[]): number => {
  let count = 0
  for (const script of scripts) {
    count += getScriptCanvasCreationCount(script)
  }
  return count
}
