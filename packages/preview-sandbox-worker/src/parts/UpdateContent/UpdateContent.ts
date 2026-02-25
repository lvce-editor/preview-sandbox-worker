import { createWindow } from '../CreateWindow/CreateWindow.ts'
import * as ExecuteScripts from '../ExecuteScripts/ExecuteScripts.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import { observe } from '../ObserveDom/ObserveDom.ts'
import * as PatchCanvasElements from '../PatchCanvasElements/PatchCanvasElements.ts'

export const updateContent = async (
  uid: number,
  width: number,
  height: number,
  content: string,
  scripts: readonly string[],
): Promise<{
  errorMessage: string
  codeFrame: any
  error: any
}> => {
  try {
    const { document: happyDomDocument, window: happyDomWindow } = createWindow(content)
    await PatchCanvasElements.patchCanvasElements(happyDomDocument, uid)
    const { codeFrame, error } = ExecuteScripts.executeScripts(happyDomWindow, happyDomDocument, scripts, width, height)
    const elementMap = Object.create(null)
    HappyDomState.set(uid, {
      document: happyDomDocument,
      elementMap,
      window: happyDomWindow,
    })
    observe(uid, happyDomDocument, happyDomWindow)

    return {
      codeFrame,
      error,
      errorMessage: '',
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      codeFrame: '',
      error,
      errorMessage,
    }
  }
}
