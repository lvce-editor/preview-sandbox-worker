import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchChangeEvent = (element: any, window: any): void => {
  const changeEvent = new window.Event('change', { bubbles: true })
  DispatchEvent.dispatchEvent(element, changeEvent)
}
