/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/no-implied-eval */
import type { Document, Window } from 'happy-dom-without-node'
import { exposeCanvasGlobals } from '../ExposeCanvasGlobals/ExposeCanvasGlobals.ts'
import { getErrorCodeFrame } from '../GetErrorCodeFrame/GetErrorCodeFrame.ts'
import { getGlobals } from '../GetGlobals/GetGlobals.ts'
import { getTopLevelFunctionNames } from '../GetTopLevelFunctionNames/GetTopLevelFunctionNames.ts'
import { getTopLevelVariableNames } from '../GetTopLevelVariableNames/GetTopLevelVariableNames.ts'
import * as RuntimeDiagnostics from '../RuntimeDiagnostics/RuntimeDiagnostics.ts'
import { setGlobals } from '../SetGlobals/SetGlobals.ts'

export interface ScriptExecutionResult {
  readonly codeFrame: string
  readonly error: Error | null
}

export const executeScripts = (
  window: Window,
  document: Document,
  scripts: readonly string[],
  width: number = 0,
  height: number = 0,
  devicePixelRatio: number = 1,
  uid: number = 0,
): ScriptExecutionResult => {
  exposeCanvasGlobals(window, document)
  const { globalGlobals, windowGlobals } = getGlobals(window, width, height, devicePixelRatio)
  setGlobals(window, globalGlobals, windowGlobals)
  const runtimeConsole = RuntimeDiagnostics.install(uid, window)
  const windowWithEval = window as Window & { eval?: (source: string) => unknown }
  if (typeof windowWithEval.eval !== 'function') {
    windowWithEval.eval = (source: string): unknown => {
      const fn = new Function('window', 'document', 'console', `with (window) { ${source} }`)
      return fn.call(window, window, document, runtimeConsole)
    }
  }
  let firstError: Error | null = null
  let firstCodeFrame = ''
  // Execute each script with the happy-dom window and document as context
  for (const scriptContent of scripts) {
    try {
      // In a browser, top-level function declarations in <script> tags become
      // properties on window. Since new Function() creates a local scope, we
      // extract function and var names and explicitly assign them to window.
      const functionNames = getTopLevelFunctionNames(scriptContent)
      const variableNames = getTopLevelVariableNames(scriptContent)
      const names = [...functionNames, ...variableNames]
      const suffix = names.map((name) => `\nwindow[${JSON.stringify(name)}] = ${name};`).join('')
      const fn = new Function('window', 'document', 'console', `with (window) { ${scriptContent}${suffix} }`)
      fn.call(window, window, document, runtimeConsole)
    } catch (error) {
      // Record the first error but continue executing remaining scripts
      if (firstError === null) {
        firstCodeFrame = getErrorCodeFrame(scriptContent, error)
        firstError = error as Error
        RuntimeDiagnostics.addException(uid, error, firstCodeFrame)
      }
    }
  }
  return { codeFrame: firstCodeFrame, error: firstError }
}
