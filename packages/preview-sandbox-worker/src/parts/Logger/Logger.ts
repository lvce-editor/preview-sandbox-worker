import { PreviewWorker } from '@lvce-editor/rpc-registry'

const send = async (command: string, ...args: readonly unknown[]): Promise<void> => {
  try {
    await PreviewWorker.invoke(command, ...args)
  } catch {
    // Logging must not break preview rendering when its output transport is unavailable.
  }
}

export const warn = (message: string): void => {
  console.warn(message)
  void send('Preview.logWarning', message)
}

export const clear = (): Promise<void> => {
  return send('Preview.clearOutput')
}
