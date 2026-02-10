import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMouseupEvent = (element: any, window: any): void => {
  const mouseupEvent = new window.MouseEvent('mouseup', { bubbles: true })
  DispatchEvent.dispatchEvent(element, mouseupEvent)
}
