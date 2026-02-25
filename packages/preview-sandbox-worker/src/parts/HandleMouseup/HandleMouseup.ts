import * as DispatchMouseupEvent from '../DispatchMouseupEvent/DispatchMouseupEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleMouseupLocal = (uid: number, hdId: string, clientX: number, clientY: number): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap[hdId]
  if (!element) {
    return
  }

  DispatchMouseupEvent.dispatchMouseupEvent(element, happyDomInstance.window, clientX, clientY)
}

export const handleMouseup = (uid: number, hdId: string, clientX: number, clientY: number): any => {
  return handleMouseupLocal(uid, hdId, clientX, clientY)
}
