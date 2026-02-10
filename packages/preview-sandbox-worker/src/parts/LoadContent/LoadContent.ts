import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const loadContent = async (state: PreviewState): Promise<PreviewState> => {
  // Try to register to receive editor change notifications from the editor worker.
  // Use dynamic access and ignore errors so this is safe in environments where
  // the EditorWorker / ListenerType are not available (e.g. unit tests).
  const EditorChange = 1
  const rpcId = 9112
  try {
    await EditorWorker.invoke('Listener.register', EditorChange, rpcId)
  } catch (error) {
    console.error(error)
  }

  // Read and parse file contents if we have a URI
  const { content, css, errorMessage, parsedDom, parsedNodesChildNodeCount, scripts } = state.uri
    ? await updateContent(state, state.uri)
    : {
        content: state.content,
        css: state.css,
        errorMessage: state.errorMessage,
        parsedDom: state.parsedDom,
        parsedNodesChildNodeCount: state.parsedNodesChildNodeCount,
        scripts: state.scripts,
      }

  const { sandboxRpc } = state
  let finalParsedDom = parsedDom
  let finalCss = css
  let finalParsedNodesChildNodeCount = parsedNodesChildNodeCount

  if (state.useSandboxWorker && scripts.length > 0) {
    await sandboxRpc.invoke('SandBox.initialize', state.uid, content, scripts)
    const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', state.uid)
    finalParsedDom = serialized.dom
    finalCss = serialized.css
    finalParsedNodesChildNodeCount = finalParsedDom.length > 0 ? finalParsedDom[0].childCount || 0 : 0
  }

  return {
    ...state,
    content,
    css: finalCss,
    errorCount: 0,
    errorMessage,
    initial: false,
    parsedDom: finalParsedDom,
    parsedNodesChildNodeCount: finalParsedNodesChildNodeCount,
    sandboxRpc,
    scripts,
    warningCount: 1,
  }
}
