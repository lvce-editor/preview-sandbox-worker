/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'
import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMousemoveEvent = (element: any, window: Window, clientX: number = 0, clientY: number = 0): void => {
  const mousemoveEvent = new window.MouseEvent('mousemove', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mousemoveEvent)
}
