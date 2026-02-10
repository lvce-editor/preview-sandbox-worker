import * as DispatchKeydownEvent from '../DispatchKeydownEvent/DispatchKeydownEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

export const handleKeydown = (uid: number, hdId: string, key: string, code: string): void => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }
  // Dispatch keydown event in happy-dom so event listeners fire
  DispatchKeydownEvent.dispatchKeydownEvent(element, happyDomInstance.window, key, code)
}
