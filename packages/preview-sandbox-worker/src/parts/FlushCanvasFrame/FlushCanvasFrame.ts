import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CanvasState from '../CanvasState/CanvasState.ts'

export const flushCanvasFrame = (uid: number): void => {
  const canvasStateEntry = CanvasState.get(uid)
  if (!canvasStateEntry) {
    return
  }
  for (const instance of canvasStateEntry.instances) {
    try {
      const bitmap = instance.offscreenCanvas.transferToImageBitmap()
      // @ts-ignore
      void RendererWorker.invoke('Preview.drawCanvas', uid, instance.dataId, bitmap)
    } catch {
      // transferToImageBitmap can fail if canvas is zero-sized
    }
  }
}
