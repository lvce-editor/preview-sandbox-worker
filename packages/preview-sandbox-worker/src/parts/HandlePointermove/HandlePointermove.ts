import * as DispatchPointermoveEvent from '../DispatchPointermoveEvent/DispatchPointermoveEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handlePointermoveLocal = (uid: number, hdId: string, clientX: number, clientY: number, x: number, y: number): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap[hdId]
  if (!element) {
    return
  }

  DispatchPointermoveEvent.dispatchPointermoveEvent(element, happyDomInstance.window, clientX - x, clientY - y)
}

export const handlePointermove = (uid: number, hdId: string, clientX: number = 0, clientY: number = 0, x: number = 0, y: number = 0): any => {
  return handlePointermoveLocal(uid, hdId, clientX, clientY, x, y)
}
