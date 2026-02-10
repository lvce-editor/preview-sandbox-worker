import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMousedownEvent from '../DispatchMousedownEvent/DispatchMousedownEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleMousedownLocal = (uid: number, hdId: string, clientX: number, clientY: number,
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
  DispatchMousedownEvent.dispatchMousedownEvent(element, happyDomInstance.window, adjustedClientX, adjustedClientY)

  const elementMap = new Map<string, any>()

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

}

export const handleMousedown = (uid: number, hdId: string, clientX: number, clientY: number,
  x: number, y: number

): PreviewState | Promise<PreviewState> => {

  return handleMousedownLocal(uid, hdId, clientX, clientY, x, y)
}
