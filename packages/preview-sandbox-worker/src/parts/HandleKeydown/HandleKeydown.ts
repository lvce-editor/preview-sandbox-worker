import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchKeydownEvent from '../DispatchKeydownEvent/DispatchKeydownEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleKeydownLocal = (uid: number, hdId: string, key: string, code: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = hdId ? happyDomInstance.elementMap.get(hdId) : happyDomInstance.document
  if (!element) {
    return
  }

  DispatchKeydownEvent.dispatchKeydownEvent(element, happyDomInstance.window, key, code)

  const elementMap = new Map<string, any>()

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })
}

export const handleKeydown = (uid: number, hdId: string, key: string, code: string): PreviewState | Promise<PreviewState> => {
  return handleKeydownLocal(uid, hdId, key, code)
}
