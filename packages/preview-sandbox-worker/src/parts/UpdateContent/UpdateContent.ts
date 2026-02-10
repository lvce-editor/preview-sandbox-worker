
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { createWindow } from '../CreateWindow/CreateWindow.ts'
import * as ExecuteScripts from '../ExecuteScripts/ExecuteScripts.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import { observe } from '../ObserveDom/ObserveDom.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as PatchCanvasElements from '../PatchCanvasElements/PatchCanvasElements.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

export const updateContent = async (
  uid: number,
  width: number, height: number,
  uri: string,
  content: string,
  scripts: readonly string[]
): Promise<{
  errorMessage: string
}> => {
  try {



    try {
      const { document: happyDomDocument, window: happyDomWindow } = createWindow(content)
      await PatchCanvasElements.patchCanvasElements(happyDomDocument, uid)
      ExecuteScripts.executeScripts(happyDomWindow, happyDomDocument, scripts, width, height)
      const elementMap = new Map<string, any>()
      HappyDomState.set(uid, {
        document: happyDomDocument,
        elementMap,
        window: happyDomWindow,
      })
      observe(uid, happyDomDocument, happyDomWindow)
    } catch (error) {
      console.error(error)
      // If script execution fails, fall back to static HTML parsing
    }


    return {
      errorMessage: '',
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      errorMessage,
    }
  }
}
