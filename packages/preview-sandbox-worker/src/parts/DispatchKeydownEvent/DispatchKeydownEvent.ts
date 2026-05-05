import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'
import * as GetKeyboardEventInit from '../GetKeyboardEventInit/GetKeyboardEventInit.ts'

const setLegacyKeyCode = (event: any, keyCode: number): void => {
  Object.defineProperty(event, 'keyCode', { value: keyCode })
  Object.defineProperty(event, 'which', { value: keyCode })
}

export const dispatchKeydownEvent = (element: any, window: any, key: string, code: string | number): void => {
  const keyboardEventInit = GetKeyboardEventInit.getKeyboardEventInit(key, code)
  const keydownEvent = new window.KeyboardEvent('keydown', {
    bubbles: true,
    code: keyboardEventInit.code,
    key: keyboardEventInit.key,
  })
  setLegacyKeyCode(keydownEvent, keyboardEventInit.keyCode)
  DispatchEvent.dispatchEvent(element, keydownEvent)
}
