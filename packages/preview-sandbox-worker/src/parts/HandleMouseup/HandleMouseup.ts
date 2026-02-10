import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMouseupEvent from '../DispatchMouseupEvent/DispatchMouseupEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const handleMouseupSandbox = async (state: PreviewState, hdId: string): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleMouseup', uid, hdId)
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

const handleMouseupLocal = (state: PreviewState, hdId: string): PreviewState => {
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return state
  }

  DispatchMouseupEvent.dispatchMouseupEvent(element, happyDomInstance.window)

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

export const handleMouseup = (state: PreviewState, hdId: string): PreviewState | Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  if (state.useSandboxWorker) {
    return handleMouseupSandbox(state, hdId)
  }
  return handleMouseupLocal(state, hdId)
}
