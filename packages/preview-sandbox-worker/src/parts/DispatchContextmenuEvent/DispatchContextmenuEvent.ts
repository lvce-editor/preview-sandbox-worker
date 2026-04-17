import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchContextmenuEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const contextmenuEvent = new window.MouseEvent('contextmenu', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, contextmenuEvent)
}
