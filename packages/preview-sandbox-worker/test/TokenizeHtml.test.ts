import { expect, test } from '@jest/globals'
import * as HtmlTokenType from '../src/parts/HtmlTokenType/HtmlTokenType.ts'
import * as TokenizeHtml from '../src/parts/TokenizeHtml/TokenizeHtml.ts'

// Helper to extract token types and texts
const getTokens = (html: string): Array<{ text: string; type: HtmlTokenType.HtmlTokenType }> => {
  return TokenizeHtml.tokenizeHtml(html).map((t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => ({ text: t.text, type: t.type }))
}

// Basic script tag tokenization
test('tokenizeHtml should tokenize empty script tag', () => {
  const tokens = getTokens('<script></script>')
  expect(tokens).toEqual([
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: 'script', type: HtmlTokenType.TagNameStart },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: '/', type: HtmlTokenType.ClosingTagSlash },
    { text: 'script', type: HtmlTokenType.TagNameEnd },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
  ])
})

test('tokenizeHtml should tokenize script with simple content', () => {
  const tokens = getTokens('<script>alert("hello")</script>')
  expect(tokens).toEqual([
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: 'script', type: HtmlTokenType.TagNameStart },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
    { text: 'alert("hello")', type: HtmlTokenType.Content },
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: '/', type: HtmlTokenType.ClosingTagSlash },
    { text: 'script', type: HtmlTokenType.TagNameEnd },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
  ])
})

// Critical test: JS with < operator should not break
test('tokenizeHtml should handle script content containing less-than operator', () => {
  const tokens = getTokens('<script>if (a < b) { alert("hi") }</script>')
  expect(tokens).toEqual([
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: 'script', type: HtmlTokenType.TagNameStart },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
    { text: 'if (a < b) { alert("hi") }', type: HtmlTokenType.Content },
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: '/', type: HtmlTokenType.ClosingTagSlash },
    { text: 'script', type: HtmlTokenType.TagNameEnd },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
  ])
})

test('tokenizeHtml should handle script content with multiple < operators', () => {
  const tokens = getTokens('<script>for (let i = 0; i < 10; i++) { if (i < 5) {} }</script>')
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('for'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe('for (let i = 0; i < 10; i++) { if (i < 5) {} }')
})

test('tokenizeHtml should handle script content with > operator', () => {
  const tokens = getTokens('<script>if (a > b) {}</script>')
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('if'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe('if (a > b) {}')
})

test('tokenizeHtml should handle script content with template literals', () => {
  const tokens = getTokens('<script>const html = `<div>hello</div>`</script>')
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('const'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe('const html = `<div>hello</div>`')
})

test('tokenizeHtml should handle script with attributes', () => {
  const tokens = getTokens('<script type="module">console.log("hi")</script>')
  expect(tokens[0]).toEqual({ text: '<', type: HtmlTokenType.OpeningAngleBracket })
  expect(tokens[1]).toEqual({ text: 'script', type: HtmlTokenType.TagNameStart })
  // Find the content token
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('console'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe('console.log("hi")')
})

test('tokenizeHtml should handle script tag followed by other content', () => {
  const tokens = getTokens('<script>var x = 1;</script><div>hello</div>')
  const scriptContent = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('var'),
  )
  expect(scriptContent).toBeDefined()
  expect(scriptContent!.text).toBe('var x = 1;')
  // Should also have div tokens after
  const divStart = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.TagNameStart && t.text === 'div',
  )
  expect(divStart).toBeDefined()
})

test('tokenizeHtml should handle multiple script tags', () => {
  const tokens = getTokens('<script>var a = 1;</script><script>var b = 2;</script>')
  const contentTokens = tokens.filter((t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content)
  expect(contentTokens.length).toBe(2)
  expect(contentTokens[0].text).toBe('var a = 1;')
  expect(contentTokens[1].text).toBe('var b = 2;')
})

test('tokenizeHtml should handle script with multiline content', () => {
  const js = `function test() {
  if (a < b) {
    return a;
  }
  return b;
}`
  const tokens = getTokens(`<script>${js}</script>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('function'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(js)
})

test('tokenizeHtml should handle script with HTML-like strings', () => {
  const js = 'document.body.innerHTML = "<p>Hello</p>"'
  const tokens = getTokens(`<script>${js}</script>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('document'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(js)
})

// Style tag raw text handling (similar to script)
test('tokenizeHtml should handle style content with angle brackets', () => {
  // This is unusual in CSS but should be handled correctly
  const css = 'div { content: "<" }'
  const tokens = getTokens(`<style>${css}</style>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('div'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(css)
})

test('tokenizeHtml should handle style tag with normal CSS', () => {
  const css = 'body { color: red; }'
  const tokens = getTokens(`<style>${css}</style>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text === css,
  )
  expect(contentToken).toBeDefined()
})

test('tokenizeHtml should handle empty style tag', () => {
  const tokens = getTokens('<style></style>')
  expect(tokens).toEqual([
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: 'style', type: HtmlTokenType.TagNameStart },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: '/', type: HtmlTokenType.ClosingTagSlash },
    { text: 'style', type: HtmlTokenType.TagNameEnd },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
  ])
})

// Edge cases
test('tokenizeHtml should handle script with no closing tag', () => {
  const tokens = getTokens('<script>var x = 1;')
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('var'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe('var x = 1;')
})

test('tokenizeHtml should handle case-insensitive script tag', () => {
  const tokens = getTokens('<SCRIPT>var x = 1;</SCRIPT>')
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('var'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe('var x = 1;')
})

test('tokenizeHtml should still tokenize normal html correctly', () => {
  const tokens = getTokens('<div>hello</div>')
  expect(tokens).toEqual([
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: 'div', type: HtmlTokenType.TagNameStart },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
    { text: 'hello', type: HtmlTokenType.Content },
    { text: '<', type: HtmlTokenType.OpeningAngleBracket },
    { text: '/', type: HtmlTokenType.ClosingTagSlash },
    { text: 'div', type: HtmlTokenType.TagNameEnd },
    { text: '>', type: HtmlTokenType.ClosingAngleBracket },
  ])
})

test('tokenizeHtml should handle script between other elements', () => {
  const tokens = getTokens('<div>before</div><script>if (a < b) {}</script><div>after</div>')
  const contentTokens = tokens.filter((t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content)
  expect(contentTokens.map((t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.text)).toEqual([
    'before',
    'if (a < b) {}',
    'after',
  ])
})

test('tokenizeHtml should handle script with arrow functions', () => {
  const js = 'const fn = (a) => a < 10 ? a : 10'
  const tokens = getTokens(`<script>${js}</script>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('=>'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(js)
})

test('tokenizeHtml should handle script with regex containing angle brackets', () => {
  const js = 'const re = /<div>/g'
  const tokens = getTokens(`<script>${js}</script>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('const re'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(js)
})

test('tokenizeHtml should handle script with JSX-like content', () => {
  const js = 'const el = React.createElement("div", null, "hello")'
  const tokens = getTokens(`<script>${js}</script>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('createElement'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(js)
})

test('tokenizeHtml should handle script with generics-like syntax', () => {
  const js = 'const arr = new Array<number>(10)'
  const tokens = getTokens(`<script>${js}</script>`)
  const contentToken = tokens.find(
    (t: Readonly<{ text: string; type: HtmlTokenType.HtmlTokenType }>) => t.type === HtmlTokenType.Content && t.text.includes('Array'),
  )
  expect(contentToken).toBeDefined()
  expect(contentToken!.text).toBe(js)
})
