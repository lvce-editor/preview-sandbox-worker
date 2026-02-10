import { PlainMessagePortRpc } from '@lvce-editor/rpc'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  await PlainMessagePortRpc.create({
    commandMap: {},
    messagePort: port,
  })
}
