import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchClickEvent from '../DispatchClickEvent/DispatchClickEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleClickLocal = (uid: number, hdId: string, clientX: number, clientY: number): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }

  DispatchClickEvent.dispatchClickEvent(element, happyDomInstance.window, clientX, clientY)

  const elementMap = Object.create(null)

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })
}

export const handleClick = (uid: number, hdId: string, clientX: number = 0, clientY: number = 0): PreviewState | Promise<PreviewState> => {
  return handleClickLocal(uid, hdId, clientX, clientY)
}
