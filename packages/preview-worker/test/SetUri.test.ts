import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { setUri } from '../src/parts/SetUri/SetUri.ts'

test('setUri should set the uri property on the state', async () => {
  const state: PreviewState = createDefaultState()
  const newUri = 'file:///home/user/test.html'

  const result = await setUri(state, newUri)

  expect(result.uri).toBe(newUri)
})

test('setUri should preserve other state properties', async () => {
  const state: PreviewState = { ...createDefaultState(), errorCount: 5, uid: 42 }
  const newUri = 'file:///home/user/test.html'

  const result = await setUri(state, newUri)

  expect(result.uri).toBe(newUri)
  expect(result.uid).toBe(42)
  expect(result.errorCount).toBe(5)
})

test('setUri should handle empty uri string', async () => {
  const state: PreviewState = { ...createDefaultState(), uri: 'file:///previous.html' }
  const newUri = ''

  const result = await setUri(state, newUri)

  expect(result.uri).toBe('')
  expect(result.uri).not.toBe('file:///previous.html')
})

test('setUri should handle different uri formats', async () => {
  const state: PreviewState = createDefaultState()
  const uris = ['file:///home/user/test.html', 'http://localhost:3000', 'https://example.com/page', 'data:text/html,<h1>Test</h1>']

  for (const uri of uris) {
    const result = await setUri(state, uri)
    expect(result.uri).toBe(uri)
  }
})
