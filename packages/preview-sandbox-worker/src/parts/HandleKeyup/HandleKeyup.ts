import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchKeyupEvent from '../DispatchKeyupEvent/DispatchKeyupEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const handleKeyupSandbox = async (state: PreviewState, hdId: string, key: string, code: string): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleKeyUp', uid, hdId, key, code)
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

const handleKeyupLocal = (state: PreviewState, hdId: string, key: string, code: string): PreviewState => {
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = hdId ? happyDomInstance.elementMap.get(hdId) : happyDomInstance.document
  if (!element) {
    return state
  }

  DispatchKeyupEvent.dispatchKeyupEvent(element, happyDomInstance.window, key, code)

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

export const handleKeyup = (state: PreviewState, hdId: string, key: string, code: string): PreviewState | Promise<PreviewState> => {
  if (state.useSandboxWorker) {
    return handleKeyupSandbox(state, hdId, key, code)
  }
  return handleKeyupLocal(state, hdId, key, code)
}
