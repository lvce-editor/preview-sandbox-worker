export interface GeometryRect {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number
}

const ENTRY_SIZE = 9
const OFFSET_EXISTS = 0
const OFFSET_X = 1
const OFFSET_Y = 2
const OFFSET_TOP = 3
const OFFSET_LEFT = 4
const OFFSET_RIGHT = 5
const OFFSET_BOTTOM = 6
const OFFSET_WIDTH = 7
const OFFSET_HEIGHT = 8

const states: Map<number, Float64Array> = new Map()

const getIndex = (hdId: string): number => {
  const value = Number(hdId)
  if (!Number.isInteger(value) || value < 0) {
    return -1
  }
  return value
}

const getOffset = (hdId: string): number => {
  const index = getIndex(hdId)
  if (index === -1) {
    return -1
  }
  return index * ENTRY_SIZE
}

export const createGeometryBuffer = (elementCount: number): ArrayBuffer | SharedArrayBuffer => {
  const size = Math.max(elementCount, 1) * ENTRY_SIZE * Float64Array.BYTES_PER_ELEMENT
  if (typeof SharedArrayBuffer === 'function') {
    return new SharedArrayBuffer(size)
  }
  return new ArrayBuffer(size)
}

export const setGeometryBuffer = (uid: number, geometryBuffer: ArrayBuffer | SharedArrayBuffer): void => {
  states.set(uid, new Float64Array(geometryBuffer))
}

export const getRect = (uid: number, hdId: string): GeometryRect | undefined => {
  const view = states.get(uid)
  if (!view) {
    return undefined
  }
  const offset = getOffset(hdId)
  if (offset === -1 || offset + ENTRY_SIZE > view.length) {
    return undefined
  }
  if (view[offset + OFFSET_EXISTS] !== 1) {
    return undefined
  }
  return {
    bottom: view[offset + OFFSET_BOTTOM],
    height: view[offset + OFFSET_HEIGHT],
    left: view[offset + OFFSET_LEFT],
    right: view[offset + OFFSET_RIGHT],
    top: view[offset + OFFSET_TOP],
    width: view[offset + OFFSET_WIDTH],
    x: view[offset + OFFSET_X],
    y: view[offset + OFFSET_Y],
  }
}

export const setRect = (uid: number, hdId: string, rect: GeometryRect): void => {
  const view = states.get(uid)
  if (!view) {
    return
  }
  const offset = getOffset(hdId)
  if (offset === -1 || offset + ENTRY_SIZE > view.length) {
    return
  }
  view[offset + OFFSET_EXISTS] = 1
  view[offset + OFFSET_X] = rect.x
  view[offset + OFFSET_Y] = rect.y
  view[offset + OFFSET_TOP] = rect.top
  view[offset + OFFSET_LEFT] = rect.left
  view[offset + OFFSET_RIGHT] = rect.right
  view[offset + OFFSET_BOTTOM] = rect.bottom
  view[offset + OFFSET_WIDTH] = rect.width
  view[offset + OFFSET_HEIGHT] = rect.height
}

export const remove = (uid: number): void => {
  states.delete(uid)
}

export const clear = (): void => {
  states.clear()
}
