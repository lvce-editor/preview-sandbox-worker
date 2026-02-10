import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { PreviewSandBoxWorker } from '@lvce-editor/rpc-registry'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: {},
    messagePort: port,
  })
  PreviewSandBoxWorker.set(rpc)
}
