import * as Preferences from '../Preferences/Preferences.ts'

const errorUids = new Set<number>()
const workerConsole: Console = globalThis.console

const isClearableError = (error: Error): boolean => {
  return error.name === 'ReferenceError' || error.name === 'SyntaxError'
}

export const handle = async (uid: number, error: Error | null): Promise<void> => {
  const hadClearableError = errorUids.delete(uid)
  if (error) {
    if (isClearableError(error)) {
      errorUids.add(uid)
    }
    return
  }
  if (!hadClearableError) {
    return
  }
  const enabled = await Preferences.get('preview.clearConsoleOnErrorResolved')
  if (enabled === true) {
    workerConsole.clear()
  }
}

export const clearAll = (): void => {
  errorUids.clear()
}
