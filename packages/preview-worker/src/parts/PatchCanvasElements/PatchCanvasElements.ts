import * as CanvasState from '../CanvasState/CanvasState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { toNumber } from '../ToNumber/ToNumber.ts'

interface CanvasCanvasDimensions {
  readonly height: number
  readonly width: number
}

export const patchCanvasElements = async (document: any, uid: number): Promise<void> => {
  const canvasElements = document.querySelectorAll('canvas')
  if (canvasElements.length === 0) {
    return
  }
  const instances: { element: any; offscreenCanvas: OffscreenCanvas; dataId: string; dimensions: CanvasCanvasDimensions }[] = []

  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const width = toNumber(element.getAttribute('width') || 300)
    const height = toNumber(element.getAttribute('height') || 300)
    element.width = width
    element.height = height
    const { canvasId, offscreenCanvas } = await getOffscreenCanvas(width, height)
    const dataId = String(canvasId)
    element.__canvasId = canvasId
    element.__offscreenCanvas = offscreenCanvas
    element.dataset.id = dataId
    const context = offscreenCanvas.getContext('2d')
    element.getContext = (contextType: string): any => {
      if (contextType === '2d') {
        return context
      }
      return undefined
    }

    // Store dimension tracking
    const dimensions: CanvasCanvasDimensions = { height, width }

    // Override width property to detect changes
    let widthValue = width
    Object.defineProperty(element, 'width', {
      configurable: true,
      enumerable: true,
      get: () => widthValue,
      set: (newWidth: number | string) => {
        widthValue = toNumber(newWidth)
        element.__offscreenCanvas.width = widthValue
      },
    })

    // Override height property to detect changes
    let heightValue = height
    Object.defineProperty(element, 'height', {
      configurable: true,
      enumerable: true,
      get: () => heightValue,
      set: (newHeight: number | string) => {
        heightValue = toNumber(newHeight)
        element.__offscreenCanvas.height = heightValue
      },
    })

    instances.push({ dataId, dimensions, element, offscreenCanvas })
  }
  CanvasState.set(uid, { animationFrameHandles: [], instances })
}
