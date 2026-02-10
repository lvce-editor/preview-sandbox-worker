import { get } from '../HappyDomState/HappyDomState.ts'
import { serialize } from '../SerializeHappyDom/SerializeHappyDom.ts'

export const getSerializedDom = (uid: number): any => {
  const item = get(uid)
  if (!item) {
    throw new Error(`No HappyDom instance found for uid ${uid}`)
  }
  const { document, elementMap } = item
  const serialized = serialize(document, elementMap)
  return serialized
}
