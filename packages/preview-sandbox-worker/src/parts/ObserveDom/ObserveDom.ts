/* eslint-disable @typescript-eslint/no-floating-promises */
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const observers: Map<number, any> = new Map()

const handleMutations = async (uid: number): Promise<void> => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }

  const elementMap = new Map<string, any>()
  const serialized = SerializeHappyDom.serialize(happyDomInstance.document, elementMap)

  HappyDomState.set(uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

  const parsedDom = serialized.dom
  // @ts-ignore
  const { css } = serialized
  // @ts-ignore
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

  // const updatedState = {
  //   css,
  //   parsedDom,
  //   parsedNodesChildNodeCount,
  // }

  // TODO notify
  try {
    await RendererWorker.invoke('Preview.rerender', uid)
  } catch {
    // ignore
  }
}

export const observe = (uid: number, document: any, window: any): void => {
  const existingObserver = observers.get(uid)
  if (existingObserver) {
    existingObserver.disconnect()
  }

  const observer = new window.MutationObserver(() => {
    handleMutations(uid)
  })

  observer.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  })

  observers.set(uid, observer)
}

export const disconnect = (uid: number): void => {
  const observer = observers.get(uid)
  if (observer) {
    observer.disconnect()
    observers.delete(uid)
  }
}
