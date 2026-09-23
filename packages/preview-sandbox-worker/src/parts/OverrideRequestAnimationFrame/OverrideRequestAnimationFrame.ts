import * as CanvasState from '../CanvasState/CanvasState.ts'
import * as Logger from '../Logger/Logger.ts'

const FRAME_INTERVAL = 16

export const overrideRequestAnimationFrame = (window: any, uid: number): void => {
  let nextId = 1
  const callbacks: Map<number, (timestamp: number) => void> = new Map()

  const tick = (): void => {
    const currentCallbacks = [...callbacks]
    callbacks.clear()
    const timestamp = performance.now()
    for (const [, callback] of currentCallbacks) {
      try {
        callback(timestamp)
      } catch (error) {
        Logger.warn(`[preview-sandbox-worker] requestAnimationFrame callback error: ${error}`)
      }
    }
  }

  window.requestAnimationFrame = (callback: (timestamp: number) => void): number => {
    const id = nextId++
    callbacks.set(id, callback)
    const handle = setTimeout(tick, FRAME_INTERVAL)
    CanvasState.addAnimationFrameHandle(uid, handle)
    return id
  }

  window.cancelAnimationFrame = (id: number): void => {
    callbacks.delete(id)
  }
}
