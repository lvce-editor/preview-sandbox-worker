import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchKeyupEvent from '../DispatchKeyupEvent/DispatchKeyupEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleKeyupLocal = (uid: number, hdId: string, key: string, code: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = hdId ? happyDomInstance.elementMap[hdId] : happyDomInstance.document
  if (!element) {
    return
  }

  DispatchKeyupEvent.dispatchKeyupEvent(element, happyDomInstance.window, key, code)

  const elementMap = Object.create(null)

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })
}

export const handleKeyup = (uid: number, hdId: string, key: string, code: string): PreviewState | Promise<PreviewState> => {
  return handleKeyupLocal(uid, hdId, key, code)
}
