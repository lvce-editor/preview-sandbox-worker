import { expect, test } from '@jest/globals'
import { getParsedNodesChildNodeCount } from '../src/parts/GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as ParseHtml from '../src/parts/ParseHtml/ParseHtml.ts'

test('getParsedNodesChildNodeCount should return 0 for empty string', () => {
  const parsed = ParseHtml.parseHtml('', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(0)
})

test('getParsedNodesChildNodeCount should return 1 for single element', () => {
  const parsed = ParseHtml.parseHtml('<div></div>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1)
})

test('getParsedNodesChildNodeCount should return 2 for two sibling elements', () => {
  const parsed = ParseHtml.parseHtml('<div></div><span></span>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(2)
})

test('getParsedNodesChildNodeCount should return 3 for three sibling elements', () => {
  const parsed = ParseHtml.parseHtml('<div></div><span></span><p></p>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(3)
})

test('getParsedNodesChildNodeCount should count nested elements as 1', () => {
  const parsed = ParseHtml.parseHtml('<div><span></span></div>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1) // Only the outer div counts as root
})

test('getParsedNodesChildNodeCount should handle text nodes', () => {
  const parsed = ParseHtml.parseHtml('Hello World', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1)
})

test('getParsedNodesChildNodeCount should count mixed content', () => {
  const parsed = ParseHtml.parseHtml('Text<div></div>More text', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(3) // text, div, text
})

test('getParsedNodesChildNodeCount should handle self-closing tags', () => {
  const parsed = ParseHtml.parseHtml('<br><hr><img>', []).dom
  // debug
  // eslint-disable-next-line no-console
  console.log(
    'DEBUG parsed:',
    parsed.map((p) => ({ childCount: p.childCount, type: p.type })),
    (parsed as any).rootChildCount,
  )
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(3)
})

test('getParsedNodesChildNodeCount should count complex structure', () => {
  const parsed = ParseHtml.parseHtml('<div><span></span></div><p>text</p>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(2) // div and p are root level
})

test('getParsedNodesChildNodeCount should handle deeply nested structure', () => {
  const parsed = ParseHtml.parseHtml('<div><div><div></div></div></div>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(1) // Only the outermost div
})

test('getParsedNodesChildNodeCount should count multiple root elements with nesting', () => {
  const parsed = ParseHtml.parseHtml('<header><h1>Title</h1></header><main><p>Content</p></main>', []).dom
  const result = getParsedNodesChildNodeCount(parsed)
  expect(result).toBe(2) // header and main
})
