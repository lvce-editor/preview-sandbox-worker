import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { rerender } from '../src/parts/Rerender/Rerender.ts'

test('rerender should return a new state object', () => {
  const state: PreviewState = createDefaultState()
  const result = rerender(state)

  // Should return a different object reference
  expect(result).not.toBe(state)
})

test('rerender should return a new parsedDom array reference', () => {
  const state: PreviewState = {
    ...createDefaultState(),
    parsedDom: [{ childCount: 0, type: 1 }],
  }
  const result = rerender(state)

  // parsedDom should be a different array reference
  expect(result.parsedDom).not.toBe(state.parsedDom)
  // But should have the same content
  expect(result.parsedDom).toEqual(state.parsedDom)
})

test('rerender should preserve all state properties', () => {
  const state: PreviewState = {
    ...createDefaultState(),
    assetDir: '/assets',
    content: '<div>test</div>',
    errorCount: 2,
    errorMessage: 'test error',
    initial: false,
    parsedDom: [
      { childCount: 1, type: 1 },
      { childCount: 0, type: 2 },
    ],
    parsedNodesChildNodeCount: 2,
    platform: 1,
    uid: 123,
    uri: 'file:///test.html',
    warningCount: 3,
  }

  const result = rerender(state)

  expect(result.assetDir).toBe(state.assetDir)
  expect(result.content).toBe(state.content)
  expect(result.errorCount).toBe(state.errorCount)
  expect(result.errorMessage).toBe(state.errorMessage)
  expect(result.initial).toBe(state.initial)
  expect(result.platform).toBe(state.platform)
  expect(result.uid).toBe(state.uid)
  expect(result.uri).toBe(state.uri)
  expect(result.warningCount).toBe(state.warningCount)
})

test('rerender should handle empty parsedDom', () => {
  const state: PreviewState = {
    ...createDefaultState(),
    parsedDom: [],
  }
  const result = rerender(state)

  expect(result.parsedDom).not.toBe(state.parsedDom)
  expect(result.parsedDom).toEqual([])
})

test('rerender should create shallow copy of parsedDom elements', () => {
  const domElement = { childCount: 2, className: 'test', type: 1 }
  const state: PreviewState = {
    ...createDefaultState(),
    parsedDom: [domElement],
  }
  const result = rerender(state)

  // Array reference should be different
  expect(result.parsedDom).not.toBe(state.parsedDom)
  // But the elements themselves are the same objects (shallow copy)
  expect(result.parsedDom[0]).toBe(state.parsedDom[0])
})
