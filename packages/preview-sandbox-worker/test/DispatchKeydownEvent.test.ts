import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchKeydownEvent from '../src/parts/DispatchKeydownEvent/DispatchKeydownEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchKeydownEvent normalizes numeric space codes for window listeners', () => {
  const window = createWindow()
  const { document } = window
  let started = false
  let jumps = 0

  window.addEventListener('keydown', (event: any) => {
    if (!started) {
      started = true
      return
    }
    if (event.code === 'Space') {
      jumps++
    }
  })

  DispatchKeydownEvent.dispatchKeydownEvent(document, window, 'a', 65 as any)
  DispatchKeydownEvent.dispatchKeydownEvent(document, window, ' ', 32 as any)

  expect(started).toBe(true)
  expect(jumps).toBe(1)
})

test('dispatchKeydownEvent keeps legacy numeric fields for compatibility', () => {
  const window = createWindow()
  const { document } = window
  let receivedEvent: any

  window.addEventListener('keydown', (event: any) => {
    receivedEvent = event
  })

  DispatchKeydownEvent.dispatchKeydownEvent(document, window, ' ', 32 as any)

  expect(receivedEvent.key).toBe(' ')
  expect(receivedEvent.code).toBe('Space')
  expect(receivedEvent.keyCode).toBe(32)
  expect(receivedEvent.which).toBe(32)
})