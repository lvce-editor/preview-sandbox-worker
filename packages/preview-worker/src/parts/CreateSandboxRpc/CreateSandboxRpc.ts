import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const createSandboxRpc = async (): Promise<any> => {
  const sandboxRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: async (port: any) =>
      await RendererWorker.invokeAndTransfer(
        'SendMessagePortToExtensionHostWorker.sendMessagePortToPreviewSandBoxWorker',
        port,
        'SandBox.handleMessagePort',
      ),
  })
  return sandboxRpc
}
