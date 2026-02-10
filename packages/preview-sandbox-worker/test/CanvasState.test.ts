import { afterEach, expect, test } from '@jest/globals'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'

afterEach(() => {
  CanvasState.clear()
})

test('get should return undefined when no state exists', () => {
  expect(CanvasState.get(1)).toBeUndefined()
})

test('set and get should store and retrieve canvas state', () => {
  const entry = { animationFrameHandles: [], instances: [] }
  CanvasState.set(1, entry)
  expect(CanvasState.get(1)).toBe(entry)
})

test('remove should delete canvas state', () => {
  const entry = { animationFrameHandles: [], instances: [] }
  CanvasState.set(1, entry)
  CanvasState.remove(1)
  expect(CanvasState.get(1)).toBeUndefined()
})

test('clear should remove all canvas states', () => {
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  CanvasState.set(2, { animationFrameHandles: [], instances: [] })
  CanvasState.clear()
  expect(CanvasState.get(1)).toBeUndefined()
  expect(CanvasState.get(2)).toBeUndefined()
})

test('addAnimationFrameHandle should add a handle', () => {
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  CanvasState.addAnimationFrameHandle(1, 42)
  const entry = CanvasState.get(1)
  expect(entry?.animationFrameHandles).toEqual([42])
})

test('removeAnimationFrameHandle should remove a handle', () => {
  CanvasState.set(1, { animationFrameHandles: [42, 43], instances: [] })
  CanvasState.removeAnimationFrameHandle(1, 42)
  const entry = CanvasState.get(1)
  expect(entry?.animationFrameHandles).toEqual([43])
})

test('removeAnimationFrameHandle should do nothing for non-existent handle', () => {
  CanvasState.set(1, { animationFrameHandles: [42], instances: [] })
  CanvasState.removeAnimationFrameHandle(1, 99)
  const entry = CanvasState.get(1)
  expect(entry?.animationFrameHandles).toEqual([42])
})

test('addAnimationFrameHandle should do nothing when uid not found', () => {
  CanvasState.addAnimationFrameHandle(99, 42)
  expect(CanvasState.get(99)).toBeUndefined()
})
