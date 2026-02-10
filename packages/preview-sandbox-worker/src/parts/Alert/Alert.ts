import { RendererWorker } from '@lvce-editor/rpc-registry'

export const alert = (message: string): void => {
  void RendererWorker.invoke('ConfirmPrompt.prompt', message)
}
