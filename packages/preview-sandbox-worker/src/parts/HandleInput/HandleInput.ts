import * as DispatchInputEvent from '../DispatchInputEvent/DispatchInputEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

export const handleInput = (uid: number, hdId: string, value: string): void => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }

  // console.log({ element })
  // Update the element's value from the preview
  element.value = value
  // Dispatch input event in happy-dom so event listeners fire
  DispatchInputEvent.dispatchInputEvent(element, happyDomInstance.window)
}
