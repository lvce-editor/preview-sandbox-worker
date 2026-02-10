/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/no-implied-eval */
import type { Document, Window } from 'happy-dom-without-node'
import { getErrorCodeFrame } from '../GetErrorCodeFrame/GetErrorCodeFrame.ts'
import { getGlobals } from '../GetGlobals/GetGlobals.ts'
import { getTopLevelFunctionNames } from '../GetTopLevelFunctionNames/GetTopLevelFunctionNames.ts'
import { setGlobals } from '../SetGlobals/SetGlobals.ts'

export const executeScripts = (window: Window, document: Document, scripts: readonly string[], width: number = 0, height: number = 0): void => {
  const { globalGlobals, windowGlobals } = getGlobals(width, height)
  setGlobals(window, globalGlobals, windowGlobals)
  // Execute each script with the happy-dom window and document as context
  for (const scriptContent of scripts) {
    try {
      // In a browser, top-level function declarations in <script> tags become
      // properties on window. Since new Function() creates a local scope, we
      // extract function names and explicitly assign them to window after execution.
      const functionNames = getTopLevelFunctionNames(scriptContent)
      const suffix = functionNames.map((name) => `\nwindow['${name}'] = ${name};`).join('')
      const fn = new Function('window', 'document', 'console', scriptContent + suffix)
      fn(window, document, console)
    } catch (error) {
      const codeFrame = getErrorCodeFrame(scriptContent, error)
      console.warn('[preview-sandbox-worker] Script execution error:', error, codeFrame)
    }
  }
}
