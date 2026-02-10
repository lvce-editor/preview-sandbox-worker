import * as DispatchKeyupEvent from '../DispatchKeyupEvent/DispatchKeyupEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

export const handleKeyup = (uid: number, hdId: string, key: string, code: string): void => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }
  // Dispatch keyup event in happy-dom so event listeners fire
  DispatchKeyupEvent.dispatchKeyupEvent(element, happyDomInstance.window, key, code)
}
