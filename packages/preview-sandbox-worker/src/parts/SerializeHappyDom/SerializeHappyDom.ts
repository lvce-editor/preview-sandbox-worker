import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Document } from 'happy-dom-without-node'
import { VirtualDomElements } from '@lvce-editor/constants'
import { text } from '@lvce-editor/virtual-dom-worker'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as IsDefaultAllowedAttribute from '../IsDefaultAllowedAttribute/IsDefaultAllowedAttribute.ts'

// Tags to skip entirely during serialization
const TAGS_TO_SKIP = new Set(['script', 'meta', 'title'])

// Tags to skip but process children
const TAGS_TO_SKIP_TAG_ONLY = new Set(['html', 'body', 'head'])

// Tags where we extract content as CSS
const CSS_TAGS = new Set(['style'])

export interface SerializeResult {
  readonly css: readonly string[]
  readonly dom: readonly VirtualDomNode[]
}

interface SerializeContext {
  readonly elementMap: Record<string, any>
  nextId: number
}

const getOrCreateHdId = (node: any, context: SerializeContext): string => {
  const existingHdId = node.getAttribute?.('data-id')
  if (existingHdId) {
    const numericValue = Number(existingHdId)
    if (Number.isInteger(numericValue) && numericValue >= context.nextId) {
      context.nextId = numericValue + 1
    }
    return existingHdId
  }
  const hdId = String(context.nextId++)
  node.setAttribute?.('data-id', hdId)
  return hdId
}

const serializeAttributeName = (attrName: string): string => {
  if (attrName === 'class') {
    return 'className'
  }
  if (attrName === 'type') {
    return 'inputType'
  }
  return attrName
}

const applyAllowedAttributes = (targetNode: any, sourceNode: any): void => {
  const { attributes } = sourceNode
  if (!attributes) {
    return
  }
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i]
    const attrName = attr.name
    if (IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attrName, [])) {
      const finalName = serializeAttributeName(attrName)
      targetNode[finalName] = attr.value
    }
  }
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const serializeNode = (node: any, dom: readonly VirtualDomNode[], css: readonly string[], context: SerializeContext): number => {
  const { nodeType } = node

  // Text node
  if (nodeType === 3) {
    const textContent = node.textContent || ''
    if (textContent) {
      ;(dom as VirtualDomNode[]).push(text(textContent))
      return 1
    }
    return 0
  }

  // Not an element node — skip
  if (nodeType !== 1) {
    return 0
  }

  const tagName = (node.tagName || '').toLowerCase()

  // Extract CSS from style elements
  if (CSS_TAGS.has(tagName)) {
    const styleContent = node.textContent || ''
    if (styleContent.trim()) {
      ;(css as string[]).push(styleContent)
    }
    return 0
  }

  // Skip certain tags entirely
  if (TAGS_TO_SKIP.has(tagName)) {
    return 0
  }

  // For html/body tags, serialize children only
  if (TAGS_TO_SKIP_TAG_ONLY.has(tagName)) {
    let childCount = 0
    const { childNodes } = node
    for (let i = 0; i < childNodes.length; i++) {
      childCount += serializeNode(childNodes[i], dom, css, context)
    }
    return childCount
  }

  // Canvas element with transferred OffscreenCanvas — emit a Reference node
  if (tagName === 'canvas' && node.__canvasId !== undefined) {
    const refNode: any = {
      childCount: 0,
      type: VirtualDomElements.Reference,
      uid: node.__canvasId,
    }
    applyAllowedAttributes(refNode, node)
    if (context.elementMap) {
      context.elementMap[node.__canvasId + ''] = node
    }
    ;(dom as VirtualDomNode[]).push(refNode)
    return 1
  }

  // Normal element - create a VirtualDomNode
  const newNode: any = {
    childCount: 0,
    type: GetVirtualDomTag.getVirtualDomTag(tagName),
  }

  applyAllowedAttributes(newNode, node)

  // Assign element tracking ID for interactivity
  const hdId = getOrCreateHdId(node, context)
  newNode['data-id'] = hdId
  context.elementMap[hdId] = node

  // Reserve position in dom array for this node
  ;(dom as VirtualDomNode[]).push(newNode)

  // Serialize children
  let childCount = 0
  const { childNodes } = node
  for (let i = 0; i < childNodes.length; i++) {
    childCount += serializeNode(childNodes[i], dom, css, context)
  }
  newNode.childCount = childCount

  return 1
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const serialize = (document: Document, elementMap: Record<string, any> = Object.create(null)): SerializeResult => {
  const dom: VirtualDomNode[] = []
  const css: string[] = []
  const context: SerializeContext = { elementMap, nextId: 0 }

  // Start from document.documentElement (the <html> element)
  const root = document.documentElement || document.body
  if (!root) {
    return { css, dom }
  }

  let rootChildCount = 0
  const { childNodes } = root
  for (let i = 0; i < childNodes.length; i++) {
    rootChildCount += serializeNode(childNodes[i], dom, css, context)
  }

  return { css, dom }
}
