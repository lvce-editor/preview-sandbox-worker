import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const createDefaultState = (): PreviewState => {
  return {
    assetDir: '',
    content: '',
    css: [],
    errorCount: 0,
    errorMessage: '',
    height: 0,
    initial: true,
    parsedDom: [],
    parsedNodesChildNodeCount: 0,
    platform: 0,
    scripts: [],
    uid: 0,
    uri: '',
    warningCount: 0,
    width: 0,
    x: 0,
    y: 0,
  }
}
