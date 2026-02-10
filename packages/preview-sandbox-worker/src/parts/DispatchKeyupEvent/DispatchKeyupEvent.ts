import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchKeyupEvent = (element: any, window: any, key: string, code: string): void => {
  const keyupEvent = new window.KeyboardEvent('keyup', {
    bubbles: true,
    code,
    key,
  })
  DispatchEvent.dispatchEvent(element, keyupEvent)
}
