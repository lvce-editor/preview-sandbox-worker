import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { set } from '../PreviewStates/PreviewStates.ts'

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
    useSandboxWorker: false,
    warningCount: 0,
    width,
    x,
    y,
  }
  set(uid, state, state)
}
