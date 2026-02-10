import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMousedownEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mousedownEvent = new window.MouseEvent('mousedown', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mousedownEvent)
}
