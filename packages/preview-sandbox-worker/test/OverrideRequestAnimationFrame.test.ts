import { afterEach, expect, jest, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import * as OverrideRequestAnimationFrame from '../src/parts/OverrideRequestAnimationFrame/OverrideRequestAnimationFrame.ts'

afterEach(() => {
  CanvasState.clear()
  jest.restoreAllMocks()
})

test('overrideRequestAnimationFrame should replace window.requestAnimationFrame', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  const originalRaf = window.requestAnimationFrame
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window as any, 1)
  expect(window.requestAnimationFrame).not.toBe(originalRaf)
})

test('overrideRequestAnimationFrame should replace window.cancelAnimationFrame', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  const originalCaf = window.cancelAnimationFrame
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window as any, 1)
  expect(window.cancelAnimationFrame).not.toBe(originalCaf)
})

test('requestAnimationFrame should return an incrementing id', () => {
  const window = new Window({ url: 'https://localhost:3000' }) as any
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window, 1)
  const id1 = window.requestAnimationFrame(() => {})
  const id2 = window.requestAnimationFrame(() => {})
  expect(id2).toBeGreaterThan(id1)
})

test('requestAnimationFrame callback should be called with a timestamp', async () => {
  const window = new Window({ url: 'https://localhost:3000' }) as any
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window, 1)
  const callback = jest.fn()
  window.requestAnimationFrame(callback)
  await new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
  expect(callback).toHaveBeenCalledTimes(1)
  expect(typeof callback.mock.calls[0][0]).toBe('number')
})

test('cancelAnimationFrame should prevent callback from firing', async () => {
  const window = new Window({ url: 'https://localhost:3000' }) as any
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window, 1)
  const callback = jest.fn()
  const id = window.requestAnimationFrame(callback)
  window.cancelAnimationFrame(id)
  await new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
  expect(callback).not.toHaveBeenCalled()
})

test('completed animation frames do not accumulate handles', async () => {
  const window = new Window({ url: 'https://localhost:3000' }) as any
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window, 1)
  window.requestAnimationFrame(() => {})
  await new Promise((resolve) => setTimeout(resolve, 50))
  expect(CanvasState.get(1)?.animationFrameHandles).toEqual([])
})

test('replacing canvas state stops an old animation loop', async () => {
  const window = new Window({ url: 'https://localhost:3000' }) as any
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  OverrideRequestAnimationFrame.overrideRequestAnimationFrame(window, 1)
  const callback = jest.fn(() => window.requestAnimationFrame(callback))
  window.requestAnimationFrame(callback)
  CanvasState.remove(1)
  CanvasState.set(1, { animationFrameHandles: [], instances: [] })
  await new Promise((resolve) => setTimeout(resolve, 50))
  expect(callback).not.toHaveBeenCalled()
})
