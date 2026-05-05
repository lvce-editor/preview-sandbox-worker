import * as DispatchPointerdownEvent from '../DispatchPointerdownEvent/DispatchPointerdownEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handlePointerdownLocal = (uid: number, hdId: string, clientX: number, clientY: number, x: number, y: number): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap[hdId]
  if (!element) {
    return
  }

  DispatchPointerdownEvent.dispatchPointerdownEvent(element, happyDomInstance.window, clientX - x, clientY - y)
}

export const handlePointerdown = (uid: number, hdId: string, clientX: number = 0, clientY: number = 0, x: number = 0, y: number = 0): any => {
  return handlePointerdownLocal(uid, hdId, clientX, clientY, x, y)
}
