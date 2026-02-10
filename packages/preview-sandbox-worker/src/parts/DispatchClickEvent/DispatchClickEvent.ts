import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchClickEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const clickEvent = new window.MouseEvent('click', { bubbles: true, clientX, clientY })
  DispatchEvent.dispatchEvent(element, clickEvent)
}
