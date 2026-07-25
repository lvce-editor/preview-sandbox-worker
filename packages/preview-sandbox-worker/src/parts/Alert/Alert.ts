import { DialogWorker } from '@lvce-editor/rpc-registry'

export const alert = (message: string): void => {
  void DialogWorker.invoke('ConfirmPrompt.prompt', message)
}
