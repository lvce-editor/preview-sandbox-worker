import { expect, test } from '@jest/globals'
import { getErrorCodeFrame } from '../src/parts/GetErrorCodeFrame/GetErrorCodeFrame.ts'

test('getErrorCodeFrame should return empty string if no error provided', () => {
  const scriptContent = 'const x = 1'
  const result = getErrorCodeFrame(scriptContent, null)
  expect(result).toBe('')
})

test('getErrorCodeFrame should return empty string if no stack trace', () => {
  const scriptContent = 'const x = 1'
  const error = new Error('test')
  error.stack = undefined
  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toBe('')
})

test('getErrorCodeFrame should return empty string if line not found in stack', () => {
  const scriptContent = 'const x = 1'
  const error = new Error('test')
  error.stack = 'at someFunction (file.js:1:5)'
  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toBe('')
})

test('getErrorCodeFrame should generate code frame for simple error', () => {
  const scriptContent = `const x = 1
const y = undefined
const z = y[0]`
  const error = new Error('Cannot read properties')
  error.stack = `Error: Cannot read properties
    at eval (eval at executeScripts (previewSandBoxWorkerMain.js:1:1), <anonymous>:5:13)`

  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toContain('const y = undefined')
  expect(result).toContain('const z = y[0]')
  expect(result).toContain('>')
  expect(result).toContain('^')
})

test('getErrorCodeFrame should include context lines', () => {
  const scriptContent = `line 1
line 2
line 3
line 4
line 5
line 6
line 7`
  const error = new Error('error at line 5')
  error.stack = `Error: error
    at eval (<anonymous>:7:5)`

  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toContain('line 3')
  expect(result).toContain('line 4')
  expect(result).toContain('line 5')
  expect(result).toContain('line 6')
  expect(result).toContain('line 7')
  expect(result).not.toContain('line 1') // Should not include line 1 (too far before with default 2 context lines)
  expect(result).not.toContain('line 2') // Should not include line 2 (too far before with default 2 context lines)
})

test('getErrorCodeFrame should handle error on first line', () => {
  const scriptContent = `const x = undefined[0]
const y = 2`
  const error = new Error('Cannot read properties')
  error.stack = `Error: Cannot read properties
    at eval (<anonymous>:3:24)`

  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toContain('const x = undefined[0]')
  expect(result).toContain('>')
})

test('getErrorCodeFrame should handle error on last line', () => {
  const scriptContent = `const x = 1
const y = 2
const z = undefined[0]`
  const error = new Error('Cannot read properties')
  error.stack = `Error: Cannot read properties
    at eval (<anonymous>:5:28)`

  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toContain('const z = undefined[0]')
  expect(result).toContain('>')
})

test('getErrorCodeFrame should format line numbers with proper padding', () => {
  const scriptContent = Array(15)
    .fill(0)
    .map((_, i) => `line ${i + 1}`)
    .join('\n')
  const error = new Error('error')
  error.stack = `Error: error
    at eval (<anonymous>:12:5)`

  const result = getErrorCodeFrame(scriptContent, error)
  // Line 10 should be padded to match the width of line 15 (2 digits)
  expect(result).toMatch(/>\s+10\s+\|\s+line 10/)
})

test('getErrorCodeFrame should return empty string for out of bounds line number', () => {
  const scriptContent = `line 1
line 2`
  const error = new Error('error')
  error.stack = `Error: error
    at eval (<anonymous>:999:5)`

  const result = getErrorCodeFrame(scriptContent, error)
  expect(result).toBe('')
})

test('getErrorCodeFrame should position caret correctly', () => {
  const scriptContent = `const map = undefined
const value = map[0]`
  const error = new Error('Cannot read properties')
  error.stack = `Error: Cannot read properties
    at eval (<anonymous>:4:18)`

  const result = getErrorCodeFrame(scriptContent, error)
  // Line 2 is "const value = map[0]"
  // Column 18 should point to the '[' in map[0]
  const lines = result.split('\n')
  const errorLineIndex = lines.findIndex((l) => l.includes('const value = map[0]'))
  expect(errorLineIndex).toBeGreaterThanOrEqual(0)
  // The next line should have the caret
  const caretLine = lines[errorLineIndex + 1] || ''
  expect(caretLine).toMatch(/\^/)
})

test('getErrorCodeFrame should handle custom context lines parameter', () => {
  const scriptContent = `line 1
line 2
line 3
line 4
line 5
line 6
line 7`
  const error = new Error('error')
  error.stack = `Error: error
    at eval (<anonymous>:6:5)`

  const result = getErrorCodeFrame(scriptContent, error, 1)
  expect(result).toContain('line 3')
  expect(result).toContain('line 4')
  expect(result).toContain('line 5')
  expect(result).not.toContain('line 2') // Should not include line 2 (outside 1-line context)
  expect(result).not.toContain('line 6') // Should not include line 6 (outside 1-line context)
})
