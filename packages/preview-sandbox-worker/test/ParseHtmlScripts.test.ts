import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { parseHtml, parseHtmlDom } from '../src/parts/ParseHtml/ParseHtml.ts'

// Basic script capture tests
test('parseHtml should capture single script content', () => {
  const result = parseHtml('<script>alert("hello")</script>')
  expect(result.scripts).toEqual(['alert("hello")'])
  expect(result.dom).toEqual([])
})

test('parseHtml should capture multiple scripts', () => {
  const result = parseHtml('<script>var a = 1;</script><script>var b = 2;</script>')
  expect(result.scripts).toEqual(['var a = 1;', 'var b = 2;'])
  expect(result.dom).toEqual([])
})

test('parseHtml should not capture empty script content', () => {
  const result = parseHtml('<script></script>')
  expect(result.scripts).toEqual([])
})

test('parseHtml should not capture whitespace-only script content', () => {
  const result = parseHtml('<script>   </script>')
  expect(result.scripts).toEqual([])
})

test('parseHtml should exclude script tags from DOM', () => {
  const result = parseHtml('<div>hello</div><script>var x = 1;</script>')
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('hello')])
  expect(result.scripts).toEqual(['var x = 1;'])
})

test('parseHtml should capture script and css separately', () => {
  const html = '<style>body { color: red; }</style><div>hello</div><script>var x = 1;</script>'
  const result = parseHtml(html)
  expect(result.css).toEqual(['body { color: red; }'])
  expect(result.scripts).toEqual(['var x = 1;'])
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('hello')])
})

test('parseHtml should capture script with less-than operator', () => {
  const result = parseHtml('<script>if (a < b) { alert(a) }</script>')
  expect(result.scripts).toEqual(['if (a < b) { alert(a) }'])
})

test('parseHtml should capture script with multiple operators', () => {
  const js = 'for (let i = 0; i < 10; i++) { if (i < 5) { console.log(i) } }'
  const result = parseHtml(`<script>${js}</script>`)
  expect(result.scripts).toEqual([js])
})

test('parseHtml should capture multiline script', () => {
  const js = `function greet(name) {
  if (name.length < 1) {
    return "Anonymous";
  }
  return "Hello, " + name;
}`
  const result = parseHtml(`<script>${js}</script>`)
  expect(result.scripts).toEqual([js])
})

// Script in full HTML document
test('parseHtml should capture script in full HTML document', () => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
  <style>body { margin: 0; }</style>
</head>
<body>
  <h1>Hello</h1>
  <script>document.querySelector("h1").textContent = "Changed"</script>
</body>
</html>`
  const result = parseHtml(html)
  expect(result.scripts).toEqual(['document.querySelector("h1").textContent = "Changed"'])
  expect(result.css).toEqual(['body { margin: 0; }'])
  // DOM should contain the h1
  const h1Node = result.dom.find((n) => n.type === VirtualDomElements.H1)
  expect(h1Node).toBeDefined()
})

// Script with HTML-modifying code
test('parseHtml should capture script that sets innerHTML', () => {
  const js = 'document.body.innerHTML = "<p>Dynamic</p>"'
  const result = parseHtml(`<div>Static</div><script>${js}</script>`)
  expect(result.scripts).toEqual([js])
})

// Multiple scripts with DOM between
test('parseHtml should capture scripts interspersed with DOM', () => {
  const html = '<script>var a = 1;</script><div>middle</div><script>var b = 2;</script>'
  const result = parseHtml(html)
  expect(result.scripts).toEqual(['var a = 1;', 'var b = 2;'])
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('middle')])
})

// parseHtmlDom should still work (backward compat)
test('parseHtmlDom should not include script content in dom', () => {
  const result = parseHtmlDom('<div>hello</div><script>var x = 1;</script>', [])
  expect(result).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('hello')])
})

test('parseHtml should handle script in head', () => {
  const html = '<head><script>var config = { debug: true };</script></head><div>Content</div>'
  const result = parseHtml(html)
  expect(result.scripts).toEqual(['var config = { debug: true };'])
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('Content')])
})

test('parseHtml should return empty scripts when no scripts present', () => {
  const result = parseHtml('<div>hello</div>')
  expect(result.scripts).toEqual([])
})

test('parseHtml should handle script with type attribute', () => {
  const result = parseHtml('<script type="module">import { x } from "./mod.js"</script>')
  expect(result.scripts).toEqual(['import { x } from "./mod.js"'])
})

test('parseHtml should capture script with arrow functions', () => {
  const js = 'const fn = (a, b) => a < b ? a : b'
  const result = parseHtml(`<script>${js}</script>`)
  expect(result.scripts).toEqual([js])
})

test('parseHtml should handle script with event handler code', () => {
  const js = `document.getElementById("btn").addEventListener("click", () => {
  const count = document.getElementById("count")
  count.textContent = parseInt(count.textContent) + 1
})`
  const result = parseHtml(`<button id="btn">Click</button><span id="count">0</span><script>${js}</script>`)
  expect(result.scripts).toEqual([js])
  const btnNode = result.dom.find((n) => n.type === VirtualDomElements.Button)
  expect(btnNode).toBeDefined()
})
