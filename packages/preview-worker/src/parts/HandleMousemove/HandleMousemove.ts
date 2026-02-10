import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMousemoveEvent from '../DispatchMousemoveEvent/DispatchMousemoveEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const handleMousemoveSandbox = async (state: PreviewState, hdId: string): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleMousemove', uid, hdId)
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

const handleMousemoveLocal = (state: PreviewState, hdId: string, clientX: number, clientY: number): PreviewState => {
  const happyDomInstance = HappyDomState.get(state.uid)
  if (!happyDomInstance) {
    return state
  }
  const element = happyDomInstance.elementMap.get(hdId)
  if (!element) {
    return state
  }

  const adjustedClientX = clientX - state.x
  const adjustedClientY = clientY - state.y
  DispatchMousemoveEvent.dispatchMousemoveEvent(element, happyDomInstance.window, adjustedClientX, adjustedClientY)

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

export const handleMousemove = (state: PreviewState, hdId: string, clientX: number, clientY: number): PreviewState | Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  if (state.useSandboxWorker) {
    return handleMousemoveSandbox(state, hdId)
  }
  return handleMousemoveLocal(state, hdId, clientX, clientY)
}
