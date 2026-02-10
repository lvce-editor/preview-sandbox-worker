import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetRenderer from '../src/parts/GetRenderer/GetRenderer.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('getRenderer should return RenderItems.renderItems for RenderItems diff type', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  expect(renderer).toBe(RenderItems.renderItems)
})

test('getRenderer should throw error for unknown diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(999)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for negative diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(-1)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for zero diff type', () => {
  expect(() => {
    GetRenderer.getRenderer(0)
  }).toThrow('unknown renderer')
})

test('getRenderer should throw error for other known diff types not implemented', () => {
  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderEditingIndex)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderFocus)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderFocusContext)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderValue)
  }).toThrow('unknown renderer')

  expect(() => {
    GetRenderer.getRenderer(DiffType.RenderSelection)
  }).toThrow('unknown renderer')
})

test('getRenderer should return a function that can be called with state', () => {
  const renderer = GetRenderer.getRenderer(DiffType.RenderItems)
  const oldState: PreviewState = createDefaultState()
  const newState: PreviewState = createDefaultState()

  expect(typeof renderer).toBe('function')
  expect(() => {
    renderer(oldState, newState)
  }).not.toThrow()
})
