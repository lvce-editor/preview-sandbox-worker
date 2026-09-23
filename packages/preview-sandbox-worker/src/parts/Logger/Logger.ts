import { PreviewWorker } from '@lvce-editor/rpc-registry'

const send = (command: string, ...args: readonly unknown[]): Promise<void> => {
  try {
    return Promise.resolve(PreviewWorker.invoke(command, ...args)).then(
      () => undefined,
      () => undefined,
    )
  } catch {
    // Logging must not break preview rendering when its output transport is unavailable.
    return Promise.resolve()
  }
}

export const warn = (message: string): void => {
  console.warn(message)
  void send('Preview.logWarning', message)
}

export const clear = (): Promise<void> => {
  return send('Preview.clearOutput')
}
