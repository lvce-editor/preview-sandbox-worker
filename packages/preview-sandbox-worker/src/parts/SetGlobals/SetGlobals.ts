/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'
import type { Globals } from '../GetGlobals/GetGlobals.ts'

export const setGlobals = (window: Window, globalGlobals: Globals['globalGlobals'], windowGlobals: Globals['windowGlobals']): void => {
  // @ts-ignore
  window.alert = windowGlobals.alert
  // @ts-ignore
  globalThis.alert = globalGlobals.alert
  // @ts-ignore
  window.localStorage = windowGlobals.localStorage
  // @ts-ignore
  globalThis.localStorage = globalGlobals.localStorage
  window.innerWidth = windowGlobals.innerWidth
  window.innerHeight = windowGlobals.innerHeight
  // @ts-ignore
  globalThis.innerWidth = globalGlobals.innerWidth
  // @ts-ignore
  globalThis.innerHeight = globalGlobals.innerHeight
}
