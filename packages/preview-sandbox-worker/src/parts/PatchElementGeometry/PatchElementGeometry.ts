import * as GeometryState from '../GeometryState/GeometryState.ts'

interface GeometryRectJson {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number
}

interface GeometryRectWithJson extends GeometryRectJson {
  readonly toJSON: () => GeometryRectJson
}

const toRect = (rect: GeometryRectJson): GeometryRectWithJson => {
  return {
    ...rect,
    toJSON: (): GeometryRectJson => rect,
  }
}

const getCanvasDimension = (element: any, name: 'width' | 'height'): number => {
  const value = Number(element[name])
  if (Number.isFinite(value)) {
    return value
  }
  const attributeValue = Number(element.getAttribute?.(name) || 0)
  if (Number.isFinite(attributeValue)) {
    return attributeValue
  }
  return 0
}

const getFallbackRect = (element: any): GeometryRectWithJson => {
  const tagName = (element.tagName || '').toLowerCase()
  if (tagName === 'canvas') {
    const width = getCanvasDimension(element, 'width')
    const height = getCanvasDimension(element, 'height')
    return toRect({
      bottom: height,
      height,
      left: 0,
      right: width,
      top: 0,
      width,
      x: 0,
      y: 0,
    })
  }
  return toRect({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  })
}

const patchElement = (uid: number, hdId: string, element: any): void => {
  element.getBoundingClientRect = (): GeometryRectWithJson => {
    const rect = GeometryState.getRect(uid, hdId)
    if (rect) {
      return toRect(rect)
    }
    return getFallbackRect(element)
  }
}

export const patchElementGeometry = (uid: number, elementMap: Record<string, any>): void => {
  for (const [hdId, element] of Object.entries(elementMap)) {
    patchElement(uid, hdId, element)
  }
}
