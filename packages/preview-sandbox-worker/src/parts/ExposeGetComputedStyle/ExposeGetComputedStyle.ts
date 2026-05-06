/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'

export const exposeGetComputedStyle = (window: Window): void => {
  const getComputedStyle = window.getComputedStyle.bind(window)
  // @ts-ignore
  globalThis.getComputedStyle = getComputedStyle
  // @ts-ignore
  window.getComputedStyle = getComputedStyle
}
