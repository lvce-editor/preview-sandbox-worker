import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMousemoveEvent from '../DispatchMousemoveEvent/DispatchMousemoveEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleMousemoveLocal = (uid: number, hdId: string, clientX: number, clientY: number,
  x: number, y: number

): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }

  const adjustedClientX = clientX - x
  const adjustedClientY = clientY - y
  DispatchMousemoveEvent.dispatchMousemoveEvent(element, happyDomInstance.window, adjustedClientX, adjustedClientY)

  const elementMap = new Map<string, any>()

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

}

export const handleMousemove = (uid: number, hdId: string, clientX: number, clientY: number, x: number, y: number): PreviewState | Promise<PreviewState> => {
  return handleMousemoveLocal(uid, hdId, clientX, clientY, x, y)
}
