import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
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
  readonly elementMap: Map<string, any> | undefined
  nextId: number
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
    if (context.elementMap) {
      context.elementMap.set(node.__canvasId + '', node)
    }
    ;(dom as VirtualDomNode[]).push(refNode)
    return 1
  }

  // Normal element - create a VirtualDomNode
  const newNode: any = {
    childCount: 0,
    type: GetVirtualDomTag.getVirtualDomTag(tagName),
  }

  // Copy allowed attributes
  const { attributes } = node
  if (attributes) {
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      const attrName = attr.name
      if (IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attrName, [])) {
        let finalName = attrName
        if (attrName === 'class') {
          finalName = 'className'
        } else if (attrName === 'type') {
          finalName = 'inputType'
        }
        newNode[finalName] = attr.value
      }
    }
  }

  // Assign element tracking ID for interactivity
  if (context.elementMap) {
    const hdId = String(context.nextId++)
    newNode['data-id'] = hdId
    context.elementMap.set(hdId, node)
  }

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
export const serialize = (document: any, elementMap?: Map<string, any>): SerializeResult => {
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

  try {
    Object.defineProperty(dom, 'rootChildCount', {
      configurable: true,
      enumerable: false,
      value: rootChildCount,
    })
  } catch {
    ;(dom as any).rootChildCount = rootChildCount
  }

  return { css, dom }
}
