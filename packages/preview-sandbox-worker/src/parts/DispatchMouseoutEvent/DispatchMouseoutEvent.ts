import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMouseoutEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mouseoutEvent = new window.MouseEvent('mouseout', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mouseoutEvent)
}
