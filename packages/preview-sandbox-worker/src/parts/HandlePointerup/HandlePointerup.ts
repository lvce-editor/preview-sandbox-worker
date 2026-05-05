import * as DispatchPointerupEvent from '../DispatchPointerupEvent/DispatchPointerupEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handlePointerupLocal = (uid: number, hdId: string, clientX: number, clientY: number, x: number, y: number): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap[hdId]
  if (!element) {
    return
  }

  DispatchPointerupEvent.dispatchPointerupEvent(element, happyDomInstance.window, clientX - x, clientY - y)
}

export const handlePointerup = (uid: number, hdId: string, clientX: number = 0, clientY: number = 0, x: number = 0, y: number = 0): any => {
  return handlePointerupLocal(uid, hdId, clientX, clientY, x, y)
}
