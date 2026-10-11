import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

const getPointerEventConstructor = (window: any): any => {
  return window.PointerEvent || window.MouseEvent
}

export const dispatchPointerdownEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0, button: number = 0): void => {
  const PointerEventConstructor = getPointerEventConstructor(window)
  const buttons = [1, 4, 2, 8, 16][button] || 0
  const pointerdownEvent = new PointerEventConstructor('pointerdown', {
    bubbles: true,
    button,
    buttons,
    clientX,
    clientY,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  })
  DispatchEvent.dispatchEvent(element, pointerdownEvent)
}
