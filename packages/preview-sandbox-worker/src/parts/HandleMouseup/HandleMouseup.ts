import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMouseupEvent from '../DispatchMouseupEvent/DispatchMouseupEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleMouseupLocal = (uid: number, hdId: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return
  }

  DispatchMouseupEvent.dispatchMouseupEvent(element, happyDomInstance.window)

  const elementMap = new Map<string, any>()

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

}

export const handleMouseup = (uid: number, hdId: string): any => {

  return handleMouseupLocal(uid, hdId)
}
