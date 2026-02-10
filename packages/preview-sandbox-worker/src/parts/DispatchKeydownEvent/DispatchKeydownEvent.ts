import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchKeydownEvent = (element: any, window: any, key: string, code: string): void => {
  const keydownEvent = new window.KeyboardEvent('keydown', {
    bubbles: true,
    code,
    key,
  })
  DispatchEvent.dispatchEvent(element, keydownEvent)
}
