/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'
import type { Globals } from '../GetGlobals/GetGlobals.ts'

export const setGlobals = (window: Window, globalGlobals: Globals['globalGlobals'], windowGlobals: Globals['windowGlobals']): void => {
  const globalScope = globalThis as any
  globalScope.addEventListener = window.addEventListener.bind(window)
  globalScope.removeEventListener = window.removeEventListener.bind(window)
  globalScope.dispatchEvent = window.dispatchEvent.bind(window)
  for (const [key, value] of Object.entries(globalGlobals)) {
    // @ts-ignore
    globalThis[key] = value
  }
  for (const [key, value] of Object.entries(windowGlobals)) {
    // @ts-ignore
    window[key] = value
  }
}
