import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMouseoverEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mouseoverEvent = new window.MouseEvent('mouseover', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, mouseoverEvent)
}
