import { RendererWorker } from '@lvce-editor/rpc-registry'

const id = 7201

export const sendMessagePortToExtensionHostWorker = async (port: any): Promise<void> => {
  await RendererWorker.sendMessagePortToExtensionHostWorker(port, id)
}
