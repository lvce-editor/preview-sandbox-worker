import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchClickEvent from '../DispatchClickEvent/DispatchClickEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleClickLocal = (uid: number, hdId: string, clientX: number, clientY: number, x: number, y: number): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap[hdId]
  if (!element) {
    return
  }

  const adjustedClientX = clientX - x
  const adjustedClientY = clientY - y
  DispatchClickEvent.dispatchClickEvent(element, happyDomInstance.window, adjustedClientX, adjustedClientY)
}

export const handleClick = (
  uid: number,
  hdId: string,
  clientX: number = 0,
  clientY: number = 0,
  x: number = 0,
  y: number = 0,
): PreviewState | Promise<PreviewState> => {
  return handleClickLocal(uid, hdId, clientX, clientY, x, y)
}
