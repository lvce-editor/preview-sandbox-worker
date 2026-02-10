import type { ExecuteScriptsResult } from '../ExecuteScriptsResult/ExecuteScriptsResult.ts'
import { createWindow } from '../CreateWindow/CreateWindow.ts'
import { executeScripts } from '../ExecuteScripts/ExecuteScripts.ts'

export const createWindowAndExecuteScripts = (rawHtml: string, scripts: readonly string[]): ExecuteScriptsResult => {
  const { document, window } = createWindow(rawHtml)
  executeScripts(window, document, scripts)
  return { document, window }
}
