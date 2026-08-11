/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Document } from 'happy-dom-without-node'
import * as CanvasState from '../CanvasState/CanvasState.ts'
import * as GeometryState from '../GeometryState/GeometryState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { toNumber } from '../ToNumber/ToNumber.ts'

interface CanvasCanvasDimensions {
  readonly height: number
  readonly width: number
}

interface CanvasReservation {
  readonly canvasId: number
  readonly offscreenCanvas: OffscreenCanvas
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

const toCanvasRect = (rect: CanvasBoundingClientRectJson): CanvasBoundingClientRect => {
  return {
    ...rect,
    toJSON: (): CanvasBoundingClientRectJson => rect,
  }
}

const reflectCanvasDimensionAttribute = (element: any, name: 'width' | 'height', value: number): void => {
  element.setAttribute(name, String(value))
}

const getCanvasDimensions = (element: any): CanvasCanvasDimensions => {
  return {
    height: toNumber(element.getAttribute('height') || 300),
    width: toNumber(element.getAttribute('width') || 300),
  }
}

export const patchCanvasElement = (element: any, uid: number, reservation: CanvasReservation): void => {
  const { height, width } = getCanvasDimensions(element)
  const { canvasId, offscreenCanvas } = reservation
  element.width = width
  element.height = height
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

  let widthValue = width
  Object.defineProperty(element, 'width', {
    configurable: true,
    enumerable: true,
    get: () => widthValue,
    set: (newWidth: number | string) => {
      widthValue = toNumber(newWidth)
      reflectCanvasDimensionAttribute(element, 'width', widthValue)
      element.__offscreenCanvas.width = widthValue
    },
  })

  let heightValue = height
  Object.defineProperty(element, 'height', {
    configurable: true,
    enumerable: true,
    get: () => heightValue,
    set: (newHeight: number | string) => {
      heightValue = toNumber(newHeight)
      reflectCanvasDimensionAttribute(element, 'height', heightValue)
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

  element.getBoundingClientRect = (): CanvasBoundingClientRect => {
    const rect = GeometryState.getRect(uid, dataId)
    if (rect) {
      return toCanvasRect(rect)
    }
    return toCanvasRect({
      bottom: heightValue,
      height: heightValue,
      left: 0,
      right: widthValue,
      top: 0,
      width: widthValue,
      x: 0,
      y: 0,
    })
  }

  CanvasState.addInstance(uid, { dataId, element, offscreenCanvas })
}

const installCanvasCreationHooks = (document: Document, uid: number, reservations: CanvasReservation[]): void => {
  const originalCreateElement = document.createElement.bind(document)
  const originalCreateElementNS = document.createElementNS.bind(document)
  const patchCreatedElement = (element: any, qualifiedName: string): any => {
    if (qualifiedName.toLowerCase() !== 'canvas' || element.__canvasId !== undefined) {
      return element
    }
    const reservation = reservations.shift()
    if (reservation) {
      patchCanvasElement(element, uid, reservation)
    }
    return element
  }

  document.createElement = ((qualifiedName: string, options?: any): any => {
    return patchCreatedElement(originalCreateElement(qualifiedName, options), qualifiedName)
  }) as typeof document.createElement

  document.createElementNS = ((namespace: string, qualifiedName: string, options?: any): any => {
    return patchCreatedElement(originalCreateElementNS(namespace, qualifiedName, options), qualifiedName)
  }) as typeof document.createElementNS
}

export const patchCanvasElements = async (document: Document, uid: number, dynamicCanvasCount: number = 0): Promise<void> => {
  CanvasState.remove(uid)
  CanvasState.set(uid, { animationFrameHandles: [], instances: [] })
  const canvasElements = document.querySelectorAll('canvas')
  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const { height, width } = getCanvasDimensions(element)
    const reservation = await getOffscreenCanvas(uid, width, height)
    patchCanvasElement(element, uid, reservation)
  }

  const reservations: CanvasReservation[] = []
  for (let i = 0; i < dynamicCanvasCount; i++) {
    reservations.push(await getOffscreenCanvas(uid, 300, 300))
  }
  installCanvasCreationHooks(document, uid, reservations)
}
