import * as CanvasState from '../CanvasState/CanvasState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'

export const patchCanvasElements = async (document: any, uid: number): Promise<void> => {
  const canvasElements = document.querySelectorAll('canvas')
  if (canvasElements.length === 0) {
    return
  }
  const instances: { element: any; offscreenCanvas: OffscreenCanvas; dataId: string }[] = []

  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const width = element.getAttribute('width') || 300
    const height = element.getAttribute('height') || 300
    element.width = width
    element.height = height
    const { canvasId, offscreenCanvas } = await getOffscreenCanvas(width, height)
    const dataId = String(canvasId)
    element.__canvasId = canvasId
    const context = offscreenCanvas.getContext('2d')
    element.getContext = (contextType: string): any => {
      if (contextType === '2d') {
        return context
      }
      return undefined
    }
    instances.push({ dataId, element, offscreenCanvas })
  }
  CanvasState.set(uid, { animationFrameHandles: [], instances })
}
