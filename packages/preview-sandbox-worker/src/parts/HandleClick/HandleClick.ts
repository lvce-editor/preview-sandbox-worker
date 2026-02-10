import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchClickEvent from '../DispatchClickEvent/DispatchClickEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleClickLocal = (uid: number, hdId: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }

  DispatchClickEvent.dispatchClickEvent(element, happyDomInstance.window)

  const elementMap = new Map<string, any>()

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })
}

export const handleClick = (uid: number, hdId: string): PreviewState | Promise<PreviewState> => {
  return handleClickLocal(uid, hdId)
}
