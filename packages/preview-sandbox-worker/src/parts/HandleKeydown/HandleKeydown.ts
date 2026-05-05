import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchKeydownEvent from '../DispatchKeydownEvent/DispatchKeydownEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleKeydownLocal = (uid: number, hdId: string, key: string, code: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }

  const { document, elementMap, window } = happyDomInstance
  const element = hdId ? elementMap[hdId] : document
  if (!element) {
    return
  }

  DispatchKeydownEvent.dispatchKeydownEvent(element, window, key, code)

  const newElementMap = Object.create(null)

  HappyDomState.set(uid, {
    document,
    elementMap: newElementMap,
    window,
  })
}

export const handleKeydown = (uid: number, hdId: string, key: string, code: string): PreviewState | Promise<PreviewState> => {
  return handleKeydownLocal(uid, hdId, key, code)
}
