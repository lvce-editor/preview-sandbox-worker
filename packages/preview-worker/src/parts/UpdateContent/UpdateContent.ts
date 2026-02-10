/* eslint-disable prefer-destructuring */
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
  state: PreviewState,
  uri: string,
): Promise<{
  content: string
  css: readonly string[]
  parsedDom: readonly VirtualDomNode[]
  parsedNodesChildNodeCount: number
  scripts: readonly string[]
  errorMessage: string
}> => {
  try {
    // Read the file content using RendererWorker RPC
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    let parsedDom = parseResult.dom
    let { css } = parseResult
    const { scripts } = parseResult

    // If scripts are present and not using sandbox worker, execute them via happy-dom and re-serialize the DOM
    if (scripts.length > 0 && !state.useSandboxWorker) {
      try {
        const { document: happyDomDocument, window: happyDomWindow } = createWindow(content)
        await PatchCanvasElements.patchCanvasElements(happyDomDocument, state.uid)
        ExecuteScripts.executeScripts(happyDomWindow, happyDomDocument, scripts, state.width, state.height)
        const elementMap = new Map<string, any>()
        const serialized = SerializeHappyDom.serialize(happyDomDocument, elementMap)
        parsedDom = serialized.dom
        css = serialized.css
        HappyDomState.set(state.uid, {
          document: happyDomDocument,
          elementMap,
          window: happyDomWindow,
        })
        observe(state.uid, happyDomDocument, happyDomWindow)
      } catch (error) {
        console.error(error)
        // If script execution fails, fall back to static HTML parsing
      }
    }

    const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

    return {
      content,
      css,
      errorMessage: '',
      parsedDom,
      parsedNodesChildNodeCount,
      scripts,
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: '',
      css: [],
      errorMessage,
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
    }
  }
}
