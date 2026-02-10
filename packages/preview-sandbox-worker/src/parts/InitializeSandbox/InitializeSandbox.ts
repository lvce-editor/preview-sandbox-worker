import { createWindow } from '../CreateWindow/CreateWindow.ts'
import * as ExecuteScripts from '../ExecuteScripts/ExecuteScripts.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as PatchCanvasElements from '../PatchCanvasElements/PatchCanvasElements.ts'

export const initializeSandbox = async (uid: number, content: string, scripts: readonly string[]): Promise<void> => {
  if (scripts.length === 0) {
    return
  }
  if (scripts.length > 0) {
    try {
      const { document: happyDomDocument, window: happyDomWindow } = createWindow(content)
      await PatchCanvasElements.patchCanvasElements(happyDomDocument, uid)
      ExecuteScripts.executeScripts(happyDomWindow, happyDomDocument, scripts)
      const elementMap = new Map<string, any>()
      HappyDomState.set(uid, {
        document: happyDomDocument,
        elementMap,
        window: happyDomWindow,
      })
    } catch (error) {
      console.error(error)
      // If script execution fails, fall back to static HTML parsing
    }
  }
}
