import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMouseleaveEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mouseleaveEvent = new window.MouseEvent('mouseleave', { bubbles: false, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mouseleaveEvent)
}
