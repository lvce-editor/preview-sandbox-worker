import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const create = async (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  platform: number,
  assetDir: string,
): Promise<void> => {
  // @ts-ignore
  const state: PreviewState = {
    assetDir,
    content: '',
    css: [],
    errorCount: 0,
    errorMessage: '',
    height,
    initial: true,
    parsedDom: [],
    parsedNodesChildNodeCount: 0,
    platform,
    scripts: [],
    uid,
    uri,
    warningCount: 0,
    width,
    x,
    y,
  }
}
