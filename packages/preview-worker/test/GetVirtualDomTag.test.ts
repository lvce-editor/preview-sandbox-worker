import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ElementTags from '../src/parts/ElementTags/ElementTags.ts'
import { getVirtualDomTag } from '../src/parts/GetVirtualDomTag/GetVirtualDomTag.ts'

// Test all valid tag mappings
test('getVirtualDomTag should return A element for "a" tag', () => {
  const result = getVirtualDomTag(ElementTags.A)
  expect(result).toBe(VirtualDomElements.A)
})

test('getVirtualDomTag should return Abbr element for "abbr" tag', () => {
  const result = getVirtualDomTag(ElementTags.Abbr)
  expect(result).toBe(VirtualDomElements.Abbr)
})

test('getVirtualDomTag should return Article element for "article" tag', () => {
  const result = getVirtualDomTag(ElementTags.Article)
  expect(result).toBe(VirtualDomElements.Article)
})

test('getVirtualDomTag should return Aside element for "aside" tag', () => {
  const result = getVirtualDomTag(ElementTags.Aside)
  expect(result).toBe(VirtualDomElements.Aside)
})

test('getVirtualDomTag should return Br element for "br" tag', () => {
  const result = getVirtualDomTag(ElementTags.Br)
  expect(result).toBe(VirtualDomElements.Br)
})

test('getVirtualDomTag should return Cite element for "cite" tag', () => {
  const result = getVirtualDomTag(ElementTags.Cite)
  expect(result).toBe(VirtualDomElements.Cite)
})

test('getVirtualDomTag should return Data element for "data" tag', () => {
  const result = getVirtualDomTag(ElementTags.Data)
  expect(result).toBe(VirtualDomElements.Data)
})

test('getVirtualDomTag should return Dd element for "dd" tag', () => {
  const result = getVirtualDomTag(ElementTags.Dd)
  expect(result).toBe(VirtualDomElements.Dd)
})

test('getVirtualDomTag should return Div element for "div" tag', () => {
  const result = getVirtualDomTag(ElementTags.Div)
  expect(result).toBe(VirtualDomElements.Div)
})

test('getVirtualDomTag should return Dl element for "dl" tag', () => {
  const result = getVirtualDomTag(ElementTags.Dl)
  expect(result).toBe(VirtualDomElements.Dl)
})

test('getVirtualDomTag should return Figcaption element for "figcaption" tag', () => {
  const result = getVirtualDomTag(ElementTags.Figcaption)
  expect(result).toBe(VirtualDomElements.Figcaption)
})

test('getVirtualDomTag should return Figure element for "figure" tag', () => {
  const result = getVirtualDomTag(ElementTags.Figure)
  expect(result).toBe(VirtualDomElements.Figure)
})

test('getVirtualDomTag should return Footer element for "footer" tag', () => {
  const result = getVirtualDomTag(ElementTags.Footer)
  expect(result).toBe(VirtualDomElements.Footer)
})

test('getVirtualDomTag should return H1 element for "h1" tag', () => {
  const result = getVirtualDomTag(ElementTags.H1)
  expect(result).toBe(VirtualDomElements.H1)
})

test('getVirtualDomTag should return H2 element for "h2" tag', () => {
  const result = getVirtualDomTag(ElementTags.H2)
  expect(result).toBe(VirtualDomElements.H2)
})

test('getVirtualDomTag should return H3 element for "h3" tag', () => {
  const result = getVirtualDomTag(ElementTags.H3)
  expect(result).toBe(VirtualDomElements.H3)
})

test('getVirtualDomTag should return H4 element for "h4" tag', () => {
  const result = getVirtualDomTag(ElementTags.H4)
  expect(result).toBe(VirtualDomElements.H4)
})

test('getVirtualDomTag should return H5 element for "h5" tag', () => {
  const result = getVirtualDomTag(ElementTags.H5)
  expect(result).toBe(VirtualDomElements.H5)
})

test('getVirtualDomTag should return Header element for "header" tag', () => {
  const result = getVirtualDomTag(ElementTags.Header)
  expect(result).toBe(VirtualDomElements.Header)
})

test('getVirtualDomTag should return Hr element for "hr" tag', () => {
  const result = getVirtualDomTag(ElementTags.Hr)
  expect(result).toBe(VirtualDomElements.Hr)
})

test('getVirtualDomTag should return Img element for "img" tag', () => {
  const result = getVirtualDomTag(ElementTags.Img)
  expect(result).toBe(VirtualDomElements.Img)
})

test('getVirtualDomTag should return Li element for "li" tag', () => {
  const result = getVirtualDomTag(ElementTags.Li)
  expect(result).toBe(VirtualDomElements.Li)
})

test('getVirtualDomTag should return Nav element for "nav" tag', () => {
  const result = getVirtualDomTag(ElementTags.Nav)
  expect(result).toBe(VirtualDomElements.Nav)
})

test('getVirtualDomTag should return Ol element for "ol" tag', () => {
  const result = getVirtualDomTag(ElementTags.Ol)
  expect(result).toBe(VirtualDomElements.Ol)
})

test('getVirtualDomTag should return P element for "p" tag', () => {
  const result = getVirtualDomTag(ElementTags.P)
  expect(result).toBe(VirtualDomElements.P)
})

test('getVirtualDomTag should return Pre element for "pre" tag', () => {
  const result = getVirtualDomTag(ElementTags.Pre)
  expect(result).toBe(VirtualDomElements.Pre)
})

test('getVirtualDomTag should return Search element for "search" tag', () => {
  const result = getVirtualDomTag(ElementTags.Search)
  expect(result).toBe(VirtualDomElements.Search)
})

test('getVirtualDomTag should return Section element for "section" tag', () => {
  const result = getVirtualDomTag(ElementTags.Section)
  expect(result).toBe(VirtualDomElements.Section)
})

test('getVirtualDomTag should return Span element for "span" tag', () => {
  const result = getVirtualDomTag(ElementTags.Span)
  expect(result).toBe(VirtualDomElements.Span)
})

test('getVirtualDomTag should return Tfoot element for "tfoot" tag', () => {
  const result = getVirtualDomTag(ElementTags.Tfoot)
  expect(result).toBe(VirtualDomElements.Tfoot)
})

test('getVirtualDomTag should return Time element for "time" tag', () => {
  const result = getVirtualDomTag(ElementTags.Time)
  expect(result).toBe(VirtualDomElements.Time)
})

// Test default case
test('getVirtualDomTag should return Div element for unknown tag', () => {
  const result = getVirtualDomTag('unknown')
  expect(result).toBe(VirtualDomElements.Div)
})

test('getVirtualDomTag should return Div element for empty string', () => {
  const result = getVirtualDomTag('')
  expect(result).toBe(VirtualDomElements.Div)
})

test('getVirtualDomTag should return Div element for invalid tag name', () => {
  const result = getVirtualDomTag('invalid-tag')
  expect(result).toBe(VirtualDomElements.Div)
})

test('getVirtualDomTag should return Div element for tag with uppercase', () => {
  const result = getVirtualDomTag('DIV')
  expect(result).toBe(VirtualDomElements.Div)
})

test('getVirtualDomTag should return Div element for tag with whitespace', () => {
  const result = getVirtualDomTag('  div  ')
  expect(result).toBe(VirtualDomElements.Div)
})

// Test function returns a number
test('getVirtualDomTag should always return a number', () => {
  const result = getVirtualDomTag(ElementTags.Div)
  expect(typeof result).toBe('number')
})

// Test consistency
test('getVirtualDomTag should return same result for same input', () => {
  const result1 = getVirtualDomTag(ElementTags.H1)
  const result2 = getVirtualDomTag(ElementTags.H1)
  expect(result1).toBe(result2)
})

// Test all tags return different values (except defaults)
test('getVirtualDomTag should return different values for different valid tags', () => {
  const h1Result = getVirtualDomTag(ElementTags.H1)
  const divResult = getVirtualDomTag(ElementTags.Div)
  const spanResult = getVirtualDomTag(ElementTags.Span)

  expect(h1Result).not.toBe(divResult)
  expect(divResult).not.toBe(spanResult)
  expect(h1Result).not.toBe(spanResult)
})
