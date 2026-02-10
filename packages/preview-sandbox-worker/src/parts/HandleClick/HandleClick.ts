import * as DispatchClickEvent from '../DispatchClickEvent/DispatchClickEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

export const handleClick = (uid: number, hdId: string): void => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }
  DispatchClickEvent.dispatchClickEvent(element, happyDomInstance.window)
}
