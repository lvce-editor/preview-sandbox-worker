import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchInputEvent from '../DispatchInputEvent/DispatchInputEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleInputLocal = (uid: number, hdId: string, value: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }

  element.value = value
  DispatchInputEvent.dispatchInputEvent(element, happyDomInstance.window)

  const elementMap = new Map<string, any>()
  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

}

export const handleInput = (uid: number, hdId: string, value: string): PreviewState | Promise<PreviewState> => {
  return handleInputLocal(uid, hdId, value)
}
