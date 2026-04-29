/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Document } from 'happy-dom-without-node'
import * as CanvasState from '../CanvasState/CanvasState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { toNumber } from '../ToNumber/ToNumber.ts'

interface CanvasCanvasDimensions {
  readonly height: number
  readonly width: number
}

interface CanvasBoundingClientRect {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly toJSON: () => CanvasBoundingClientRectJson
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number
}

interface CanvasBoundingClientRectJson {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number
}

export const patchCanvasElements = async (document: Document, uid: number): Promise<void> => {
  const canvasElements = document.querySelectorAll('canvas')
  if (canvasElements.length === 0) {
    return
  }
  const instances: { element: any; offscreenCanvas: OffscreenCanvas; dataId: string; dimensions: CanvasCanvasDimensions }[] = []

  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const width = toNumber(element.getAttribute('width') || 300)
    const height = toNumber(element.getAttribute('height') || 300)
    // @ts-ignore
    element.width = width
    // @ts-ignore
    element.height = height
    const { canvasId, offscreenCanvas } = await getOffscreenCanvas(uid, width, height)
    const dataId = String(canvasId)
    // @ts-ignore
    element.__canvasId = canvasId
    // @ts-ignore
    element.__offscreenCanvas = offscreenCanvas
    element.dataset.id = dataId
    const context = offscreenCanvas.getContext('2d')
    // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
        element.__offscreenCanvas.height = heightValue
      },
    })

    Object.defineProperty(element, 'clientWidth', {
      configurable: true,
      enumerable: true,
      get: () => widthValue,
    })

    Object.defineProperty(element, 'clientHeight', {
      configurable: true,
      enumerable: true,
      get: () => heightValue,
    })

    Object.defineProperty(element, 'offsetWidth', {
      configurable: true,
      enumerable: true,
      get: () => widthValue,
    })

    Object.defineProperty(element, 'offsetHeight', {
      configurable: true,
      enumerable: true,
      get: () => heightValue,
    })

    // @ts-ignore
    element.getBoundingClientRect = (): CanvasBoundingClientRect => {
      return {
        bottom: heightValue,
        height: heightValue,
        left: 0,
        right: widthValue,
        toJSON: (): CanvasBoundingClientRectJson => {
          return {
            bottom: heightValue,
            height: heightValue,
            left: 0,
            right: widthValue,
            top: 0,
            width: widthValue,
            x: 0,
            y: 0,
          }
        },
        top: 0,
        width: widthValue,
        x: 0,
        y: 0,
      }
    }

    instances.push({ dataId, dimensions, element, offscreenCanvas })
  }
  CanvasState.set(uid, { animationFrameHandles: [], instances })
}
