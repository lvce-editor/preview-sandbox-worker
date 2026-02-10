import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchKeydownEvent from '../DispatchKeydownEvent/DispatchKeydownEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const handleKeydownSandbox = async (state: PreviewState, hdId: string, key: string, code: string): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleKeyDown', uid, hdId, key, code)
  const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
  const parsedDom = serialized.dom
  const { css } = serialized
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)
  return {
    ...state,
    css,
    parsedDom,
    parsedNodesChildNodeCount,
  }
}

const handleKeydownLocal = (state: PreviewState, hdId: string, key: string, code: string): PreviewState => {
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = hdId ? happyDomInstance.elementMap.get(hdId) : happyDomInstance.document
  if (!element) {
    return state
  }

  DispatchKeydownEvent.dispatchKeydownEvent(element, happyDomInstance.window, key, code)

  const elementMap = new Map<string, any>()
  const serialized = SerializeHappyDom.serialize(happyDomInstance.document, elementMap)

  HappyDomState.set(state.uid, {
    document: happyDomInstance.document,
    elementMap,
    window: happyDomInstance.window,
  })

  const parsedDom = serialized.dom
  const { css } = serialized
  const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

  return {
    ...state,
    css,
    parsedDom,
    parsedNodesChildNodeCount,
  }
}

export const handleKeydown = (state: PreviewState, hdId: string, key: string, code: string): PreviewState | Promise<PreviewState> => {
  if (state.useSandboxWorker) {
    return handleKeydownSandbox(state, hdId, key, code)
  }
  return handleKeydownLocal(state, hdId, key, code)
}
