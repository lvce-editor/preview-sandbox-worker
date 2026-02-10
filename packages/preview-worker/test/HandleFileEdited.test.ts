import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleFileEdited } from '../src/parts/HandleFileEdited/HandleFileEdited.ts'

test('handleFileEdited should return a PreviewState with updated content', async () => {
  const state: PreviewState = {
    ...createDefaultState(),
    assetDir: '/assets',
    uid: 123,
    uri: 'file://test.html',
  }

  // The function should call updateContent and return an updated state
  // We test that all properties are preserved and content/parsedDom can be set
  const result = await handleFileEdited(state)

  // Verify that result is a PreviewState with the original properties preserved
  expect(result.uid).toBe(123)
  expect(result.assetDir).toBe('/assets')
  expect(result.uri).toBe('file://test.html')
  expect(result).toHaveProperty('content')
  expect(result).toHaveProperty('parsedDom')
  expect(typeof result.content).toBe('string')
  expect(Array.isArray(result.parsedDom)).toBe(true)
})

test('handleFileEdited should preserve all immutable state properties', async () => {
  const state: PreviewState = {
    ...createDefaultState(),
    assetDir: '/public',
    errorCount: 5,
    initial: false,
    platform: 1,
    uid: 456,
    uri: 'file://complex.html',
    warningCount: 10,
  }

  const result = await handleFileEdited(state)

  // Verify all properties are preserved
  expect(result.uid).toBe(456)
  expect(result.assetDir).toBe('/public')
  expect(result.platform).toBe(1)
  expect(result.errorCount).toBe(5)
  expect(result.warningCount).toBe(10)
  expect(result.initial).toBe(false)
  expect(result.uri).toBe('file://complex.html')
})

test('handleFileEdited should return a new state object', async () => {
  const state: PreviewState = {
    ...createDefaultState(),
    uri: 'file://test.html',
  }

  const result = await handleFileEdited(state)

  // Verify that a new object is returned, not the same reference
  expect(result).not.toBe(state)
  // Verify all immutable properties are preserved
  expect(result.uid).toBe(state.uid)
  expect(result.assetDir).toBe(state.assetDir)
  expect(result.platform).toBe(state.platform)
  expect(result.errorCount).toBe(state.errorCount)
  expect(result.warningCount).toBe(state.warningCount)
  expect(result.initial).toBe(state.initial)
  expect(result.uri).toBe(state.uri)
})

test('handleFileEdited should handle file reading gracefully', async () => {
  // Test with invalid URI - updateContent should catch the error
  const state: PreviewState = {
    ...createDefaultState(),
    uri: 'file://nonexistent-file-xyz.html',
  }

  const result = await handleFileEdited(state)

  // Even if file read fails, should return valid state with empty content/parsedDom
  expect(result).toBeDefined()
  expect(result.uid).toBe(state.uid)
  expect(typeof result.content).toBe('string')
  expect(Array.isArray(result.parsedDom)).toBe(true)
  // When file read fails, errorMessage should be set
  expect(result.errorMessage).not.toBe('')
})
