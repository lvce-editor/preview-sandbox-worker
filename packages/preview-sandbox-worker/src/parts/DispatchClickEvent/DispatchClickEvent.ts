import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchClickEvent = (element: any, window: any): void => {
  const clickEvent = new window.MouseEvent('click', { bubbles: true })
  DispatchEvent.dispatchEvent(element, clickEvent)
}
