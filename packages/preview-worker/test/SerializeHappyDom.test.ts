import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { Window } from 'happy-dom-without-node'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

// Helper to create a happy-dom document from HTML
const createDocument = (html: string): any => {
  const window = new Window({ url: 'https://localhost:3000' })
  window.document.documentElement.innerHTML = html
  return window.document
}

// Basic serialization
test('serialize should handle empty document', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const result = SerializeHappyDom.serialize(window.document)
  expect(result.dom).toBeDefined()
  expect(result.css).toEqual([])
})

test('serialize should serialize a single div', () => {
  const doc = createDocument('<body><div>hello</div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('hello')])
})

test('serialize should serialize nested elements', () => {
  const doc = createDocument('<body><div><span>text</span></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, { childCount: 1, type: VirtualDomElements.Span }, text('text')])
})

test('serialize should serialize multiple sibling elements', () => {
  const doc = createDocument('<body><div>first</div><div>second</div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([
    { childCount: 1, type: VirtualDomElements.Div },
    text('first'),
    { childCount: 1, type: VirtualDomElements.Div },
    text('second'),
  ])
})

test('serialize should handle text nodes', () => {
  const doc = createDocument('<body>just text</body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([text('just text')])
})

// Attribute handling
test('serialize should convert class to className', () => {
  const doc = createDocument('<body><div class="container"></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 0, className: 'container', type: VirtualDomElements.Div }])
})

test('serialize should convert type to inputType', () => {
  const doc = createDocument('<body><input type="text"></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 0, inputType: 'text', type: VirtualDomElements.Input }])
})

test('serialize should include id attribute', () => {
  const doc = createDocument('<body><div id="main"></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 0, id: 'main', type: VirtualDomElements.Div }])
})

test('serialize should include data attributes', () => {
  const doc = createDocument('<body><div data-value="42"></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 0, 'data-value': '42', type: VirtualDomElements.Div }])
})

test('serialize should include aria attributes', () => {
  const doc = createDocument('<body><div aria-label="Close"></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ 'aria-label': 'Close', childCount: 0, type: VirtualDomElements.Div }])
})

test('serialize should include style attribute', () => {
  const doc = createDocument('<body><div style="color: red;"></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  const divNode = result.dom[0]
  expect(divNode.style).toBeDefined()
})

// Skip tags
test('serialize should skip script tags', () => {
  const doc = createDocument('<body><div>hello</div><script>var x = 1;</script></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.Div }, text('hello')])
})

test('serialize should skip meta tags', () => {
  const doc = createDocument('<head><meta charset="utf-8"></head><body><div>content</div></body>')
  const result = SerializeHappyDom.serialize(doc)
  const divNode = result.dom.find((n) => n.type === VirtualDomElements.Div)
  expect(divNode).toBeDefined()
})

test('serialize should skip title tags', () => {
  const doc = createDocument('<head><title>Page Title</title></head><body><div>content</div></body>')
  const result = SerializeHappyDom.serialize(doc)
  // No text node with "Page Title" should appear
  const titleText = result.dom.find((n) => n.text === 'Page Title')
  expect(titleText).toBeUndefined()
})

// CSS extraction
test('serialize should extract CSS from style tags', () => {
  const doc = createDocument('<head><style>body { color: red; }</style></head><body><div>content</div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.css).toEqual(['body { color: red; }'])
})

test('serialize should extract multiple CSS blocks', () => {
  const doc = createDocument('<head><style>body { color: red; }</style><style>.box { width: 100px; }</style></head><body></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.css).toEqual(['body { color: red; }', '.box { width: 100px; }'])
})

// Complex structures
test('serialize should handle list structure', () => {
  const doc = createDocument('<body><ul><li>A</li><li>B</li></ul></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([
    { childCount: 2, type: VirtualDomElements.Ul },
    { childCount: 1, type: VirtualDomElements.Li },
    text('A'),
    { childCount: 1, type: VirtualDomElements.Li },
    text('B'),
  ])
})

test('serialize should handle table structure', () => {
  const doc = createDocument('<body><table><tr><td>Cell</td></tr></table></body>')
  const result = SerializeHappyDom.serialize(doc)
  const tableNode = result.dom.find((n) => n.type === VirtualDomElements.Table)
  expect(tableNode).toBeDefined()
  const cellText = result.dom.find((n) => n.text === 'Cell')
  expect(cellText).toBeDefined()
})

test('serialize should handle heading elements', () => {
  const doc = createDocument('<body><h1>Title</h1><h2>Subtitle</h2></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([
    { childCount: 1, type: VirtualDomElements.H1 },
    text('Title'),
    { childCount: 1, type: VirtualDomElements.H2 },
    text('Subtitle'),
  ])
})

test('serialize should handle form elements', () => {
  const doc = createDocument('<body><input type="text" id="name"><button>Submit</button></body>')
  const result = SerializeHappyDom.serialize(doc)
  const inputNode = result.dom.find((n) => n.type === VirtualDomElements.Input)
  expect(inputNode).toBeDefined()
  expect(inputNode!.inputType).toBe('text')
  const buttonNode = result.dom.find((n) => n.type === VirtualDomElements.Button)
  expect(buttonNode).toBeDefined()
})

test('serialize should handle deeply nested structure', () => {
  const doc = createDocument('<body><div><div><div><span>deep</span></div></div></div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect(result.dom).toEqual([
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.Div },
    { childCount: 1, type: VirtualDomElements.Span },
    text('deep'),
  ])
})

// Test rootChildCount
test('serialize should set rootChildCount on dom array', () => {
  const doc = createDocument('<body><div>a</div><div>b</div><div>c</div></body>')
  const result = SerializeHappyDom.serialize(doc)
  expect((result.dom as any).rootChildCount).toBe(3)
})

test('serialize should handle body tag being skipped', () => {
  const doc = createDocument('<body><p>hello</p></body>')
  const result = SerializeHappyDom.serialize(doc)
  // body tag itself should be skipped, only children
  expect(result.dom).toEqual([{ childCount: 1, type: VirtualDomElements.P }, text('hello')])
})

test('serialize should handle navigation structure', () => {
  const doc = createDocument('<body><nav><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li></ul></nav></body>')
  const result = SerializeHappyDom.serialize(doc)
  const navNode = result.dom.find((n) => n.type === VirtualDomElements.Nav)
  expect(navNode).toBeDefined()
  const homeLink = result.dom.find((n) => n.href === '/')
  expect(homeLink).toBeDefined()
})

test('serialize should handle article with classes', () => {
  const doc = createDocument('<body><article class="post featured"><h1>Title</h1><p>Content</p></article></body>')
  const result = SerializeHappyDom.serialize(doc)
  const articleNode = result.dom.find((n) => n.type === VirtualDomElements.Article)
  expect(articleNode).toBeDefined()
  expect(articleNode!.className).toBe('post featured')
})

// Test with dynamically modified DOM (simulating what ExecuteScripts does)
test('serialize should correctly serialize DOM modified by script execution', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const doc = window.document
  doc.documentElement.innerHTML = '<body><div id="target">before</div></body>'

  // Simulate script execution
  const target = doc.querySelector('#target')
  if (target) {
    target.textContent = 'after'
  }

  const result = SerializeHappyDom.serialize(doc)
  const textNode = result.dom.find((n) => n.text === 'after')
  expect(textNode).toBeDefined()
  // "before" should not appear
  const oldTextNode = result.dom.find((n) => n.text === 'before')
  expect(oldTextNode).toBeUndefined()
})

test('serialize should handle DOM with added children', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const doc = window.document
  doc.documentElement.innerHTML = '<body><ul id="list"></ul></body>'

  // Add items dynamically
  const list = doc.querySelector('#list')
  if (list) {
    for (let i = 0; i < 3; i++) {
      const li = doc.createElement('li')
      li.textContent = `Item ${i}`
      list.append(li)
    }
  }

  const result = SerializeHappyDom.serialize(doc)
  const ulNode = result.dom.find((n) => n.type === VirtualDomElements.Ul)
  expect(ulNode).toBeDefined()
  expect(ulNode!.childCount).toBe(3)
})
