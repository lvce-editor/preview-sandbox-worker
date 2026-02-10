import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import * as Assert from '../Assert/Assert.ts'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.ts'
import * as IsDefaultAllowedAttribute from '../IsDefaultAllowedAttribute/IsDefaultAllowedAttribute.ts'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.ts'
import * as ParseText from '../ParseText/ParseText.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'

// Tags that should be completely skipped (both tag and content)
const TAGS_TO_SKIP_COMPLETELY = new Set(['meta', 'title'])

// Tags that should have their opening/closing tags skipped but content processed
const TAGS_TO_SKIP_TAG_ONLY = new Set(['html', 'head'])

// Tags where we capture content as CSS
const TAGS_TO_CAPTURE_AS_CSS = new Set(['style'])

// Tags where we capture content as JavaScript
const TAGS_TO_CAPTURE_AS_JS = new Set(['script'])

export interface ParseResult {
  readonly css: readonly string[]
  readonly dom: readonly VirtualDomNode[]
  readonly scripts: readonly string[]
}

export const parseHtml = (html: string, allowedAttributes: readonly string[] = [], defaultAllowedAttributes: readonly string[] = []): ParseResult => {
  Assert.string(html)
  Assert.array(allowedAttributes)
  Assert.array(defaultAllowedAttributes)

  // Combine default allowed attributes with any additional ones provided
  const allAllowedAttributes = new Set([...defaultAllowedAttributes, ...allowedAttributes])
  const useBuiltInDefaults = allowedAttributes.length === 0
  const tokens = TokenizeHtml.tokenizeHtml(html)
  const dom: VirtualDomNode[] = []
  const css: string[] = []
  const scripts: string[] = []
  const root: VirtualDomNode = {
    childCount: 0,
    type: 0,
  }
  let current: any = root
  const stack: VirtualDomNode[] = [root]
  const tagStack: string[] = [] // Track tag names to match closing tags
  let attributeName = ''
  let lastTagWasSelfClosing = false
  let skipDepth = 0 // Track how many levels deep we are in skipped content
  let captureCss = false // Track if we're inside a style tag
  let cssContent = '' // Accumulate CSS content
  let captureJs = false // Track if we're inside a script tag
  let jsContent = '' // Accumulate JavaScript content

  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.AttributeName:
        if (skipDepth === 0 && !captureCss && !captureJs) {
          attributeName = token.text
        }
        break
      case HtmlTokenType.AttributeValue:
        if (
          skipDepth === 0 &&
          !captureCss &&
          !captureJs &&
          (allAllowedAttributes.has(attributeName) ||
            (useBuiltInDefaults && IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, defaultAllowedAttributes)))
        ) {
          let finalAttributeName = attributeName
          if (attributeName === 'class') finalAttributeName = 'className'
          else if (attributeName === 'type') finalAttributeName = 'inputType'
          current[finalAttributeName] = token.text
        }
        attributeName = ''
        break
      case HtmlTokenType.ClosingAngleBracket:
        if (skipDepth === 0 && !captureCss && !captureJs) {
          // Handle boolean attributes (attributes without values)
          if (
            attributeName &&
            (allAllowedAttributes.has(attributeName) ||
              (useBuiltInDefaults && IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, defaultAllowedAttributes)))
          ) {
            let finalAttributeName = attributeName
            if (attributeName === 'class') finalAttributeName = 'className'
            else if (attributeName === 'type') finalAttributeName = 'inputType'
            current[finalAttributeName] = attributeName
          }
          attributeName = ''
          // Return to parent if the current tag is self-closing
          if (lastTagWasSelfClosing) {
            current = stack.at(-1) || root
            lastTagWasSelfClosing = false
          }
        }
        break
      case HtmlTokenType.Content:
        if (captureCss) {
          cssContent += token.text
        } else if (captureJs) {
          jsContent += token.text
        } else if (skipDepth === 0) {
          current.childCount++
          dom.push(text(ParseText.parseText(token.text)))
        }
        break
      case HtmlTokenType.Doctype:
        // Ignore DOCTYPE - it's parsed but not rendered since we're in a div
        break
      case HtmlTokenType.TagNameEnd:
        const tagNameToClose = tagStack.pop()?.toLowerCase() || ''

        if (TAGS_TO_CAPTURE_AS_CSS.has(tagNameToClose)) {
          // Finished capturing CSS
          if (cssContent.trim()) {
            css.push(cssContent)
          }
          cssContent = ''
          captureCss = false
        } else if (TAGS_TO_CAPTURE_AS_JS.has(tagNameToClose)) {
          // Finished capturing JavaScript
          if (jsContent.trim()) {
            scripts.push(jsContent)
          }
          jsContent = ''
          captureJs = false
        } else if (TAGS_TO_SKIP_COMPLETELY.has(tagNameToClose)) {
          // We were skipping this content, so decrement skipDepth
          skipDepth--
        } else if (TAGS_TO_SKIP_TAG_ONLY.has(tagNameToClose)) {
          // We were not skipping children, so nothing to do for skipDepth
        } else {
          // Normal tag - pop from stack
          if (stack.length > 1) {
            stack.pop()
          }
          current = stack.at(-1) || root
        }
        break
      case HtmlTokenType.TagNameStart:
        const tagNameLower = token.text.toLowerCase()
        lastTagWasSelfClosing = IsSelfClosingTag.isSelfClosingTag(token.text)

        // Check if this tag captures CSS content
        if (TAGS_TO_CAPTURE_AS_CSS.has(tagNameLower)) {
          captureCss = true
          cssContent = ''
          tagStack.push(token.text)
        }
        // Check if this tag captures JavaScript content
        else if (TAGS_TO_CAPTURE_AS_JS.has(tagNameLower)) {
          captureJs = true
          jsContent = ''
          tagStack.push(token.text)
        }
        // Check if this tag should be completely skipped (meta, title)
        else if (TAGS_TO_SKIP_COMPLETELY.has(tagNameLower)) {
          if (!lastTagWasSelfClosing) {
            // For non-self-closing tags like title, mark as skipped
            skipDepth++
            tagStack.push(token.text)
          }
          // For self-closing tags like meta, we just skip them without tracking
        }
        // Check if this tag should have its opening/closing tags skipped (html, head)
        else if (TAGS_TO_SKIP_TAG_ONLY.has(tagNameLower)) {
          if (!lastTagWasSelfClosing) {
            // Track the tag name for matching the closing tag
            tagStack.push(token.text)
          }
        }
        // Normal tag processing
        else if (skipDepth === 0) {
          current.childCount++
          const newNode: VirtualDomNode = {
            childCount: 0,
            type: GetVirtualDomTag.getVirtualDomTag(token.text),
          }
          dom.push(newNode)
          current = newNode
          if (!lastTagWasSelfClosing) {
            stack.push(current)
            tagStack.push(token.text)
          }
        }
        break
      case HtmlTokenType.WhitespaceInsideOpeningTag:
        if (
          skipDepth === 0 &&
          !captureCss &&
          !captureJs && // Handle boolean attributes (attributes without values)
          attributeName &&
          (allAllowedAttributes.has(attributeName) ||
            (useBuiltInDefaults && IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, defaultAllowedAttributes)))
        ) {
          let finalAttributeName = attributeName
          if (attributeName === 'class') finalAttributeName = 'className'
          else if (attributeName === 'type') finalAttributeName = 'inputType'
          current[finalAttributeName] = attributeName
        }
        attributeName = ''
        break
      default:
        break
    }
  }
  try {
    Object.defineProperty(dom, 'rootChildCount', {
      configurable: true,
      enumerable: false,
      value: root.childCount,
    })
  } catch {
    ;(dom as any).rootChildCount = root.childCount
  }

  return { css, dom, scripts }
}

// Test helper: returns just the DOM array for backward compatibility with existing tests
export const parseHtmlDom = (
  html: string,
  allowedAttributes: readonly string[] = [],
  defaultAllowedAttributes: readonly string[] = [],
): readonly VirtualDomNode[] => {
  return parseHtml(html, allowedAttributes, defaultAllowedAttributes).dom
}
