/* eslint-disable @typescript-eslint/no-floating-promises */
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'
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

  const { newState: state, oldState } = PreviewStates.get(uid)
  const parsedDom = serialized.dom
  const { css } = serialized
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

  const updatedState = {
    ...state,
    css,
    parsedDom,
    parsedNodesChildNodeCount,
  }

  PreviewStates.set(uid, oldState, updatedState)
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
