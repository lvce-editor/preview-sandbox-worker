import type { ExecuteScriptsResult } from '../ExecuteScriptsResult/ExecuteScriptsResult.ts'
import { createWindow } from '../CreateWindow/CreateWindow.ts'
import { executeScripts } from '../ExecuteScripts/ExecuteScripts.ts'

export const createWindowAndExecuteScripts = (
  rawHtml: string,
  scripts: readonly string[],
  width: number = 0,
  height: number = 0,
  devicePixelRatio: number = 1,
): ExecuteScriptsResult => {
  const { document, window } = createWindow(rawHtml)
  const { codeFrame, error } = executeScripts(window, document, scripts, width, height, devicePixelRatio)
  return { codeFrame, document, error, window }
}
