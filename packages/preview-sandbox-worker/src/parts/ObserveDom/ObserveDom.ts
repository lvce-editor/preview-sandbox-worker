/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/no-floating-promises */
import type { Document, MutationObserver, Window } from 'happy-dom-without-node'
import { PreviewWorker } from '@lvce-editor/rpc-registry'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const observers: Map<number, MutationObserver> = new Map()

const handleMutations = async (uid: number): Promise<void> => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }

  const elementMap = Object.create(null)
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

  try {
    await PreviewWorker.invoke('Preview.handleMutation', uid)
  } catch (error) {
    console.error(error)
    // ignore
  }
}

export const observe = (uid: number, document: Document, window: Window): void => {
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
