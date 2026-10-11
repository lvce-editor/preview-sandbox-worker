import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import { dispatchWheelEvent } from '../src/parts/DispatchWheelEvent/DispatchWheelEvent.ts'

test('dispatchWheelEvent forwards the wheel delta and modifier state', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const element = window.document.createElement('canvas')
  let deltaY = 0
  let ctrlKey = false
  element.addEventListener('wheel', (event: Readonly<unknown>) => {
    const { ctrlKey: nextCtrlKey, deltaY: nextDeltaY } = event as Readonly<WheelEvent>
    deltaY = nextDeltaY
    ctrlKey = nextCtrlKey
  })

  dispatchWheelEvent(element, window, -300, true)

  expect(deltaY).toBe(-300)
  expect(ctrlKey).toBe(true)
})
