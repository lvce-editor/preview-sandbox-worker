import { expect, test } from '@jest/globals'
import { getCanvasCreationCount } from '../src/parts/GetCanvasCreationCount/GetCanvasCreationCount.ts'

test('counts literal canvas creation sites', () => {
  const scripts = [
    `
      const first = document.createElement('canvas')
      const second = document.createElement("CANVAS")
      const third = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')
    `,
  ]

  expect(getCanvasCreationCount(scripts)).toBe(3)
})

test('counts canvas creation sites across scripts', () => {
  expect(getCanvasCreationCount([`document.createElement('canvas')`, `document.createElement('canvas')`])).toBe(2)
})

test('ignores non-canvas and computed creation', () => {
  const scripts = [
    `
      document.createElement('div')
      document.createElement(tagName)
      otherDocument.createElement('canvas')
    `,
  ]

  expect(getCanvasCreationCount(scripts)).toBe(0)
})

test('ignores canvas text in comments and strings', () => {
  const scripts = [
    `
      // document.createElement('canvas')
      const example = "document.createElement('canvas')"
    `,
  ]

  expect(getCanvasCreationCount(scripts)).toBe(0)
})

test('returns zero when a script cannot be parsed', () => {
  expect(getCanvasCreationCount([`const =`])).toBe(0)
})
