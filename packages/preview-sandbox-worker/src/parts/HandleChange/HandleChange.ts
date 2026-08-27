import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchChangeEvent from '../DispatchChangeEvent/DispatchChangeEvent.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

const handleChangeLocal = (uid: number, hdId: string, value: string): any => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }
  const element = happyDomInstance.elementMap[hdId]
  if (!element) {
    return
  }

  element.value = value
  DispatchChangeEvent.dispatchChangeEvent(element, happyDomInstance.window)

  const elementMap = Object.create(null)
  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })
}

export const handleChange = (uid: number, hdId: string, value: string): PreviewState | Promise<PreviewState> => {
  return handleChangeLocal(uid, hdId, value)
}
