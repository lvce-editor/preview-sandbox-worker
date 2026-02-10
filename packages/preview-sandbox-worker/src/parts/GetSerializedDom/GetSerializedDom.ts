import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

export const getSerializedDom = (uid: number): { readonly css: readonly string[]; readonly dom: readonly any[] } => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return { css: [], dom: [] }
  }

  const elementMap = new Map<string, any>()
  const serialized = SerializeHappyDom.serialize(happyDomInstance.document, elementMap)

  // Update happy-dom state with new element map
  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

  return {
    css: serialized.css,
    dom: serialized.dom,
  }
}
