/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { afterEach, beforeAll, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { Window } from 'happy-dom-without-node'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import { executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'
import * as PatchCanvasElements from '../src/parts/PatchCanvasElements/PatchCanvasElements.ts'

// OffscreenCanvas is a Web Worker API not available in Node.js
// Provide a minimal mock for testing
class MockOffscreenCanvas {
  width: number
  height: number
  readonly oncontextlost: ((this: any, ev: Readonly<Event>) => any) | null = null
  readonly oncontextrestored: ((this: any, ev: Readonly<Event>) => any) | null = null

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getContext(_type: string): any {
    return {
      arc: (): void => {},
      beginPath: (): void => {},
      clearRect: (): void => {},
      closePath: (): void => {},
      fill: (): void => {},
      fillRect: (): void => {},
      fillStyle: '',
      fillText: (): void => {},
      font: '',
      lineTo: (): void => {},
      moveTo: (): void => {},
      stroke: (): void => {},
      strokeStyle: '',
    }
  }

  transferToImageBitmap(): any {
    return {}
  }

  async convertToBlob(): Promise<Blob> {
    return new Blob()
  }

  addEventListener(_type: string, _listener: any, _options?: Readonly<boolean | AddEventListenerOptions>): void {}

  removeEventListener(_type: string, _listener: any, _options?: Readonly<boolean | EventListenerOptions>): void {}

  dispatchEvent(_event: Readonly<Event>): boolean {
    return true
  }
}

beforeAll(() => {
  if (globalThis.OffscreenCanvas === undefined) {
    // @ts-ignore
    globalThis.OffscreenCanvas = MockOffscreenCanvas
  }
})

afterEach(() => {
  CanvasState.clear()
})

test('patchCanvasElements should do nothing when no canvas elements exist', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><div>hello</div></body>'
  await PatchCanvasElements.patchCanvasElements(document, 1)
  expect(CanvasState.get(1)).toBeUndefined()
})

test('patchCanvasElements should create OffscreenCanvas for canvas element', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(320, 480)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state).toBeDefined()
  expect(state?.instances.length).toBe(1)
  expect(state?.instances[0].offscreenCanvas).toBe(mockOffscreenCanvas)
})

test('patchCanvasElements should make getContext return a real 2d context', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(320, 480)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const ctx = canvas.getContext('2d')
  expect(ctx).toBeDefined()
  expect(typeof ctx.fillRect).toBe('function')
  expect(typeof ctx.clearRect).toBe('function')
  expect(typeof ctx.arc).toBe('function')
  expect(typeof ctx.beginPath).toBe('function')
  expect(typeof ctx.fillText).toBe('function')
})

test('patchCanvasElements should return undefined for non-2d context', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(320, 480)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const ctx = canvas.getContext('webgl')
  expect(ctx).toBeUndefined()
})

test('patchCanvasElements should handle multiple canvas elements', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas><canvas width="200" height="200"></canvas></body>'
  const mockOffscreenCanvas1 = new MockOffscreenCanvas(100, 100)
  const mockOffscreenCanvas2 = new MockOffscreenCanvas(200, 200)
  const canvases = [mockOffscreenCanvas1, mockOffscreenCanvas2]
  let callIndex = 0
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, canvases[callIndex], callIndex)
      callIndex++
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state?.instances.length).toBe(2)
  expect(state?.instances[0].offscreenCanvas).toBe(mockOffscreenCanvas1)
  expect(state?.instances[1].offscreenCanvas).toBe(mockOffscreenCanvas2)
})

test('patchCanvasElements should set __canvasId on canvas elements', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(100, 100)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 42)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  expect(canvas.__canvasId).toBeDefined()
  expect(typeof canvas.__canvasId).toBe('number')
})
test('patchCanvasElements should allow width/height property changes', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas></body>'
  const mockOffscreenCanvas1 = new MockOffscreenCanvas(100, 100)
  const mockOffscreenCanvas2 = new MockOffscreenCanvas(200, 150)
  let callCount = 0
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      callCount++
      const canvas = callCount === 1 ? mockOffscreenCanvas1 : mockOffscreenCanvas2
      executeCallback(id, canvas, callCount)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const initialWidth = canvas.width
  const initialHeight = canvas.height
  expect(initialWidth).toBe(100)
  expect(initialHeight).toBe(100)

  // Change width and height properties
  canvas.width = 200
  canvas.height = 150

  // Verify the properties were updated
  expect(canvas.width).toBe(200)
  expect(canvas.height).toBe(150)
})

test.skip('patchCanvasElements callback should be called on dimension changes', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(100, 100)
  const changes: Array<{ width: number; height: number }> = []

  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })

  // @ts-ignore
  await PatchCanvasElements.patchCanvasElements(document, 1, async (element, width, height) => {
    changes.push({ height, width })
  })

  const canvas = document.querySelector('canvas') as any

  // Change width first
  canvas.width = 200

  // Wait for the async callback to complete
  await new Promise((resolve) => setTimeout(resolve, 50))

  // Change height
  canvas.height = 150

  // Give async operations time to complete
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Callback should have been called at least once
  expect(changes.length).toBeGreaterThan(0)
  // Last change should be width=200, height=150
  expect(changes[changes.length - 1]).toEqual({ height: 150, width: 200 })
})

test('patchCanvasElements should set data-id attribute on canvas elements', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(100, 100)

  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })

  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  expect(canvas.dataset.id).toBeDefined()
  expect(canvas.dataset.id).toBe(String(canvas.__canvasId))
})

test.skip('patchCanvasElements callback should include cssRule parameter on dimension changes', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(100, 100)
  const changes: Array<{ width: number; height: number; cssRule?: string }> = []

  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })

  // @ts-ignore
  await PatchCanvasElements.patchCanvasElements(document, 1, async (element, width, height, cssRule) => {
    changes.push({ cssRule, height, width })
  })

  const canvas = document.querySelector('canvas') as any
  const dataUid = canvas.dataset.id

  // Change width
  canvas.width = 200

  // Wait for the async callback to complete
  await new Promise((resolve) => setTimeout(resolve, 50))

  // The callback should have been called with a CSS rule
  expect(changes.length).toBeGreaterThan(0)
  expect(changes[changes.length - 1].cssRule).toBeDefined()
  expect(changes[changes.length - 1].cssRule).toContain(`[data-id="${dataUid}"]`)
  expect(changes[changes.length - 1].cssRule).toContain('width: 200px')
})
