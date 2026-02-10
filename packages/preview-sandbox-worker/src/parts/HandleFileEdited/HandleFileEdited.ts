import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const handleFileEdited = async (state: PreviewState): Promise<PreviewState> => {
  const { content, css, errorMessage, parsedDom, parsedNodesChildNodeCount, scripts } = await updateContent(state, state.uri)

  return {
    ...state,
    content,
    css,
    errorMessage,
    parsedDom,
    parsedNodesChildNodeCount,
    scripts,
  }
}
