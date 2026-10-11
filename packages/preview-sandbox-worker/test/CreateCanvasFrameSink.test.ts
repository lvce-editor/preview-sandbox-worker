import { expect, jest, test } from '@jest/globals'
import { createCanvasFrameSink } from '../src/parts/CreateCanvasFrameSink/CreateCanvasFrameSink.ts'

const setup = (): {
  bitmaps: { close: ReturnType<typeof jest.fn> }[]
  canvas: any
  context: any
  port: any
  sink: ReturnType<typeof createCanvasFrameSink>
} => {
  const bitmaps: { close: ReturnType<typeof jest.fn> }[] = []
  const canvas = {
    height: 480,
    transferToImageBitmap: jest.fn(() => {
      const bitmap = { close: jest.fn() }
      bitmaps.push(bitmap)
      return bitmap
    }),
    width: 640,
  }
  const port = { close: jest.fn(), onmessage: null as any, postMessage: jest.fn() }
  const context = { drawElements: jest.fn() }
  const sink = createCanvasFrameSink(canvas as unknown as OffscreenCanvas, port as unknown as MessagePort)
  sink.observeContext(context, 'webgl2')
  return { bitmaps, canvas, context, port, sink }
}

test('coalesces draws and keeps only one frame in transit and the latest pending frame', async () => {
  const { bitmaps, context, port } = setup()
  context.drawElements()
  context.drawElements()
  await Promise.resolve()
  expect(bitmaps).toHaveLength(1)
  expect(port.postMessage).toHaveBeenCalledWith({ bitmap: bitmaps[0], type: 'frame' }, [bitmaps[0]])
  context.drawElements()
  await Promise.resolve()
  context.drawElements()
  await Promise.resolve()
  expect(port.postMessage).toHaveBeenCalledTimes(1)
  expect(bitmaps[1].close).toHaveBeenCalledTimes(1)
  port.onmessage({ data: { type: 'presented' } })
  expect(port.postMessage).toHaveBeenLastCalledWith({ bitmap: bitmaps[2], type: 'frame' }, [bitmaps[2]])
})

test('disposal closes pending frames and cancels queued capture without allocating another bitmap', async () => {
  const { bitmaps, context, port, sink } = setup()
  context.drawElements()
  await Promise.resolve()
  context.drawElements()
  await Promise.resolve()
  context.drawElements()
  sink.dispose()
  sink.dispose()
  await Promise.resolve()
  expect(bitmaps).toHaveLength(2)
  expect(bitmaps[1].close).toHaveBeenCalledTimes(1)
  expect(port.postMessage).toHaveBeenLastCalledWith({ type: 'dispose' })
  expect(port.close).toHaveBeenCalledTimes(1)
  expect(port.onmessage).toBeNull()
})

test('does not capture zero-sized canvases or wrap a context twice', async () => {
  const { canvas, context, sink } = setup()
  const draw = context.drawElements
  sink.observeContext(context, 'webgl2')
  expect(context.drawElements).toBe(draw)
  canvas.width = 0
  context.drawElements()
  await Promise.resolve()
  expect(canvas.transferToImageBitmap).not.toHaveBeenCalled()
})
