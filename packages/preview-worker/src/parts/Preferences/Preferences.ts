import { RendererWorker } from '@lvce-editor/rpc-registry'

export const get = async (key: string): Promise<any> => {
  return RendererWorker.getPreference(key)
}
