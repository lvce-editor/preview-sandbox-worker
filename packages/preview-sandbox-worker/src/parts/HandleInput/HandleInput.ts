import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchInputEvent from '../DispatchInputEvent/DispatchInputEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const handleInputSandbox = async (state: PreviewState, hdId: string, value: string): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleInput', uid, hdId, value)
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

const handleInputLocal = (state: PreviewState, hdId: string, value: string): PreviewState => {
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return state
  }

  element.value = value
  DispatchInputEvent.dispatchInputEvent(element, happyDomInstance.window)

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

export const handleInput = (state: PreviewState, hdId: string, value: string): PreviewState | Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  if (state.useSandboxWorker) {
    return handleInputSandbox(state, hdId, value)
  }
  return handleInputLocal(state, hdId, value)
}
