import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMousemoveEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mousemoveEvent = new window.MouseEvent('mousemove', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mousemoveEvent)
}
