import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const loadContent = async (
  uid: number,
  width: number, height: number,
  content: string,
  scripts: readonly string[]


): Promise<{
  errorMessage: string
}> => {
  // Try to register to receive editor change notifications from the editor worker.
  // Use dynamic access and ignore errors so this is safe in environments where
  // the EditorWorker / ListenerType are not available (e.g. unit tests).

  // Read and parse file contents if we have a URI
  const { errorMessage } = await updateContent(
    uid,
    width, height,
    content,
    scripts

  )


  return {
    errorMessage,
  }
}
