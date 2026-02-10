import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMouseupEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mouseupEvent = new window.MouseEvent('mouseup', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mouseupEvent)
}
