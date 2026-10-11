import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchWheelEvent = (element: any, window: any, deltaY: number = 0, ctrlKey: boolean = false): void => {
  const WheelEventConstructor = window.WheelEvent || window.MouseEvent
  const wheelEvent = new WheelEventConstructor('wheel', {
    bubbles: true,
    cancelable: true,
    ctrlKey,
    deltaY,
  })
  Object.defineProperties(wheelEvent, {
    ctrlKey: { value: ctrlKey },
    deltaY: { value: deltaY },
  })
  DispatchEvent.dispatchEvent(element, wheelEvent)
}
