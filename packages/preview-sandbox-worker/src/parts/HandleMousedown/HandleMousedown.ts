import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DispatchMousedownEvent from '../DispatchMousedownEvent/DispatchMousedownEvent.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

const handleMousedownSandbox = async (state: PreviewState, hdId: string): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.handleMousedown', uid, hdId)
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

const handleMousedownLocal = (state: PreviewState, hdId: string, clientX: number, clientY: number): PreviewState => {
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
  DispatchMousedownEvent.dispatchMousedownEvent(element, happyDomInstance.window, adjustedClientX, adjustedClientY)

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

export const handleMousedown = (state: PreviewState, hdId: string, clientX: number, clientY: number): PreviewState | Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  if (state.useSandboxWorker) {
    return handleMousedownSandbox(state, hdId)
  }
  return handleMousedownLocal(state, hdId, clientX, clientY)
}
