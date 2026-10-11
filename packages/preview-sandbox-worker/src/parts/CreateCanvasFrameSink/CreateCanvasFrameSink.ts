/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import * as Logger from '../Logger/Logger.ts'

interface FrameSink {
  readonly dispose: () => void
  readonly observeContext: (context: any, contextType: string) => void
}

const paintMethods = [
  'clear',
  'clearBufferfv',
  'clearBufferiv',
  'clearBufferuiv',
  'clearBufferfi',
  'drawArrays',
  'drawElements',
  'drawRangeElements',
  'drawArraysInstanced',
  'drawElementsInstanced',
  'blitFramebuffer',
  'clearRect',
  'drawImage',
  'fill',
  'fillRect',
  'fillText',
  'putImageData',
  'stroke',
  'strokeRect',
  'strokeText',
]

export const createCanvasFrameSink = (canvas: OffscreenCanvas, port: MessagePort): FrameSink => {
  let disposed = false
  let queued = false
  let inFlight = false
  let copying = false
  let dirty = false
  let webgl = false
  let glContext: any
  let pending: ImageBitmap | undefined
  const observed = new WeakSet<object>()

  const send = (bitmap: ImageBitmap): void => {
    if (disposed) {
      bitmap.close()
    } else if (inFlight) {
      pending?.close()
      pending = bitmap
    } else {
      inFlight = true
      port.postMessage({ bitmap, type: 'frame' }, [bitmap])
    }
  }

  const schedule = (): void => {
    if (disposed || queued) return
    queued = true
    queueMicrotask(() => {
      queued = false
      if (disposed || !canvas.width || !canvas.height || glContext?.isContextLost?.()) return
      if (copying) {
        dirty = true
        return
      }
      if (webgl) {
        // Capture before the browser clears the WebGL drawing buffer at task end.
        try {
          send(canvas.transferToImageBitmap())
        } catch (error) {
          Logger.warn(`[preview-sandbox-worker] canvas frame capture failed: ${error}`)
        }
        return
      }
      copying = true
      void createImageBitmap(canvas)
        .then(send)
        .catch((error: unknown) => {
          if (!disposed) Logger.warn(`[preview-sandbox-worker] canvas frame capture failed: ${error}`)
        })
        .finally(() => {
          copying = false
          if (dirty) {
            dirty = false
            schedule()
          }
        })
    })
  }

  port.onmessage = (event): void => {
    if (disposed || event.data?.type !== 'presented') return
    inFlight = false
    if (pending) {
      const bitmap = pending
      pending = undefined
      send(bitmap)
    }
  }
  return {
    dispose: (): void => {
      if (disposed) return
      disposed = true
      pending?.close()
      pending = undefined
      port.postMessage({ type: 'dispose' })
      port.onmessage = null
      port.close()
    },
    observeContext: (context: any, contextType: string): void => {
      if (!context || observed.has(context)) return
      observed.add(context)
      webgl = contextType === 'webgl' || contextType === 'webgl2'
      if (webgl) glContext = context
      for (const name of paintMethods) {
        if (typeof context[name] !== 'function') continue
        const paint = context[name].bind(context)
        context[name] = (...args: readonly any[]): any => {
          const result = paint(...args)
          schedule()
          return result
        }
      }
    },
  }
}
