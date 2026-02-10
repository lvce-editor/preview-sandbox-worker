import { EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'

export const handleEditorChanged = async (): Promise<void> => {
  // Get all preview instance keys
  const previewKeys = PreviewStates.getKeys()

  // Get all editor keys from the editor worker
  const editorKeys = await EditorWorker.invoke('Editor.getKeys')

  // For each preview instance
  for (const previewUid of previewKeys) {
    const { newState: state } = PreviewStates.get(previewUid)

    // Skip if no URI is set
    if (!state.uri) {
      continue
    }

    // Find the editor that matches our preview's URI
    let matchingEditorUid: any = null
    for (const editorKey of editorKeys) {
      const editorUid = Number.parseFloat(editorKey)
      const editorUri = await EditorWorker.invoke('Editor.getUri', editorUid)
      if (editorUri === state.uri) {
        matchingEditorUid = editorUid
        break
      }
    }

    // If we found a matching editor, get its text and update the preview
    if (matchingEditorUid !== null) {
      try {
        const content = await EditorWorker.invoke('Editor.getText', matchingEditorUid)
        const parseResult = ParseHtml.parseHtml(content, [])

        const updatedState = {
          ...state,
          content,
          css: parseResult.css,
          errorMessage: '',
          parsedDom: parseResult.dom,
          scripts: parseResult.scripts,
        }

        PreviewStates.set(previewUid, state, updatedState)
      } catch (error) {
        // If getting text fails, update with error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const updatedState = {
          ...state,
          content: '',
          css: [],
          errorMessage,
          parsedDom: [],
          scripts: [],
        }

        PreviewStates.set(previewUid, state, updatedState)
      }
    }
  }

  // Rerender all previews after updates are complete
  await RendererWorker.invoke('Preview.rerender')
}
