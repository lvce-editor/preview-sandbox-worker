import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'
import * as GetKeyboardEventInit from '../GetKeyboardEventInit/GetKeyboardEventInit.ts'

const setLegacyKeyCode = (event: any, keyCode: number): void => {
  Object.defineProperty(event, 'keyCode', { value: keyCode })
  Object.defineProperty(event, 'which', { value: keyCode })
}

export const dispatchKeyupEvent = (element: any, window: any, key: string, code: string | number): void => {
  const keyboardEventInit = GetKeyboardEventInit.getKeyboardEventInit(key, code)
  const keyupEvent = new window.KeyboardEvent('keyup', {
    bubbles: true,
    code: keyboardEventInit.code,
    key: keyboardEventInit.key,
  })
  setLegacyKeyCode(keyupEvent, keyboardEventInit.keyCode)
  DispatchEvent.dispatchEvent(element, keyupEvent)
}
