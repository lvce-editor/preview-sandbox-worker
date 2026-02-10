import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getOffscreenCanvas, executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'

test('getOffscreenCanvas should invoke RendererWorker with correct parameters', async () => {
  const mockOffscreenCanvas = {} as OffscreenCanvas
  const mockCanvasId = 42
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, mockCanvasId)
    },
  })

  const result = await getOffscreenCanvas(0, 0)

  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.createForPreview', 0, 0, 0]])
  expect(result).toEqual({ canvasId: mockCanvasId, offscreenCanvas: mockOffscreenCanvas })
})

test('getOffscreenCanvas should return the OffscreenCanvas from RendererWorker', async () => {
  const mockCanvas = {} as OffscreenCanvas
  const mockCanvasId = 10
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockCanvas, mockCanvasId)
    },
  })

  const result = await getOffscreenCanvas(100, 200)

  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.createForPreview', 1, 100, 200]])
  expect(result).toEqual({ canvasId: mockCanvasId, offscreenCanvas: mockCanvas })
})

test('getOffscreenCanvas should propagate errors from RendererWorker', async () => {
  const testError = new Error('Failed to create OffscreenCanvas')
  using mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': () => {
      throw testError
    },
  })

  await expect(getOffscreenCanvas(0, 0)).rejects.toThrow(testError)
  expect(mockRpc.invocations).toEqual([['OffscreenCanvas.createForPreview', 2, 0, 0]])
})
