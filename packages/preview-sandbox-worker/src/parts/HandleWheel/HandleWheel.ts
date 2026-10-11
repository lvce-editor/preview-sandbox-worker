import * as DispatchWheelEvent from '../DispatchWheelEvent/DispatchWheelEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

export const handleWheel = (uid: number, hdId: string, deltaY: number = 0, ctrlKey: boolean = false): void => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) return
  const element = happyDomInstance.elementMap[hdId]
  if (!element) return
  DispatchWheelEvent.dispatchWheelEvent(element, happyDomInstance.window, deltaY, ctrlKey)
}
