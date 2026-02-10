import { expect, test } from '@jest/globals'
import { createWindow } from '../src/parts/CreateWindow/CreateWindow.ts'

test('createWindow should create a window and document', () => {
  const html = '<html><body><div>hello</div></body></html>'
  const result = createWindow(html)
  expect(result.window).toBeDefined()
  expect(result.document).toBeDefined()
})

test('createWindow should parse HTML into document', () => {
  const html = '<html><body><div id="test">content</div></body></html>'
  const { document } = createWindow(html)
  const element = document.querySelector('#test')
  expect(element).toBeDefined()
  expect(element.textContent).toBe('content')
})

test('createWindow should handle complex HTML structure', () => {
  const html = `
    <html>
      <head><title>Test Page</title></head>
      <body>
        <div class="container">
          <h1>Title</h1>
          <p>Paragraph</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </body>
    </html>
  `
  const { document } = createWindow(html)
  expect(document.querySelector('title')?.textContent).toBe('Test Page')
  expect(document.querySelector('h1')?.textContent).toBe('Title')
  expect(document.querySelectorAll('li').length).toBe(2)
})

test('createWindow should handle empty HTML', () => {
  const html = ''
  const result = createWindow(html)
  expect(result.window).toBeDefined()
  expect(result.document).toBeDefined()
})

test('createWindow should set URL to localhost:3000', () => {
  const html = '<html><body></body></html>'
  const { window } = createWindow(html)
  expect(window.location.href).toContain('localhost:3000')
})

test('createWindow should return fresh window instances for each call', () => {
  const html = '<html><body><div id="test">content</div></body></html>'
  const result1 = createWindow(html)
  const result2 = createWindow(html)
  expect(result1.window).not.toBe(result2.window)
  expect(result1.document).not.toBe(result2.document)
})

test('createWindow should handle canvas with id attribute', () => {
  const html = '<html><body><canvas id="game" width="320" height="480"></canvas></body></html>'
  const { document } = createWindow(html)
  const canvas = document.querySelector('#game')
  expect(canvas).toBeDefined()
  expect(canvas?.getAttribute('id')).toBe('game')
  expect(canvas?.getAttribute('width')).toBe('320')
  expect(canvas?.getAttribute('height')).toBe('480')
})
