import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchInputEvent = (element: any, window: any): void => {
  const inputEvent = new window.Event('input', { bubbles: true })
  DispatchEvent.dispatchEvent(element, inputEvent)
}
