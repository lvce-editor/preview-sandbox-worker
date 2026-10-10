import { afterEach, expect, jest, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import { exposeCanvasGlobals } from '../src/parts/ExposeCanvasGlobals/ExposeCanvasGlobals.ts'
import { patchCanvasElement } from '../src/parts/PatchCanvasElements/PatchCanvasElements.ts'

const originalConstructor = Object.getOwnPropertyDescriptor(globalThis, 'CanvasRenderingContext2D')
afterEach(() => {
  CanvasState.clear()
  if (originalConstructor) {
    Object.defineProperty(globalThis, 'CanvasRenderingContext2D', originalConstructor)
  } else {
    delete (globalThis as any).CanvasRenderingContext2D
  }
})

test('canvas initialization does not select 2d before a WebGL request and forwards context options', () => {
  const window = new Window()
  const canvas = window.document.createElement('canvas') as any
  window.document.body.append(canvas)
  const context = { getExtension: jest.fn(() => null) }
  const getContext = jest.fn((_type: string, _options?: unknown) => context)
  const offscreenCanvas = { getContext, height: 300, width: 300 } as unknown as OffscreenCanvas
  patchCanvasElement(canvas, 1, { canvasId: 1, offscreenCanvas })
  exposeCanvasGlobals(window, window.document)
  expect(getContext).not.toHaveBeenCalled()
  const options = { alpha: false, antialias: true }
  expect(canvas.getContext('webgl2', options)).toBe(context)
  expect(getContext).toHaveBeenCalledWith('webgl2', options)
  canvas.width = 640
  canvas.height = 360
  expect(offscreenCanvas.width).toBe(640)
  expect(offscreenCanvas.height).toBe(360)
})

test('replacing canvas state releases WebGL contexts without acquiring a new context', () => {
  const window = new Window()
  const canvas = window.document.createElement('canvas') as any
  const loseContext = jest.fn()
  const getExtension = jest.fn((_name: string) => ({ loseContext }))
  const getContext = jest.fn((_type: string) => ({ getExtension }))
  const offscreenCanvas = { getContext, height: 300, width: 300 } as unknown as OffscreenCanvas
  patchCanvasElement(canvas, 1, { canvasId: 1, offscreenCanvas })
  canvas.getContext('webgl2')
  CanvasState.remove(1)
  expect(getExtension).toHaveBeenCalledWith('WEBGL_lose_context')
  expect(loseContext).toHaveBeenCalledTimes(1)
  expect(getContext).toHaveBeenCalledTimes(1)
  CanvasState.remove(1)
  expect(loseContext).toHaveBeenCalledTimes(1)
})

test('2d canvas remains usable and removing it does not try to acquire WebGL', () => {
  const window = new Window()
  const canvas = window.document.createElement('canvas') as any
  const context = { fillRect: jest.fn() }
  const getContext = jest.fn((_type: string, _options?: unknown) => context)
  const offscreenCanvas = { getContext, height: 300, width: 300 } as unknown as OffscreenCanvas
  patchCanvasElement(canvas, 1, { canvasId: 1, offscreenCanvas })
  canvas.getContext('2d').fillRect(0, 0, 10, 10)
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 10, 10)
  CanvasState.clear()
  expect(getContext).toHaveBeenCalledTimes(1)
})
