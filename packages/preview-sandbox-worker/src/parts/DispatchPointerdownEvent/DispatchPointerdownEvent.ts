import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

const getPointerEventConstructor = (window: any): any => {
  return window.PointerEvent || window.MouseEvent
}

export const dispatchPointerdownEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const PointerEventConstructor = getPointerEventConstructor(window)
  const pointerdownEvent = new PointerEventConstructor('pointerdown', {
    bubbles: true,
    clientX,
    clientY,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'mouse',
  })
  DispatchEvent.dispatchEvent(element, pointerdownEvent)
}
