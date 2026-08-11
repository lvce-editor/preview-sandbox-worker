import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchChangeEvent from '../src/parts/DispatchChangeEvent/DispatchChangeEvent.ts'

test('dispatchChangeEvent fires a bubbling change event', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<div id="parent"><input id="input" type="color" value="#ff0000"></div>'
  const parent = document.querySelector('#parent') as any
  const input = document.querySelector('#input') as any
  let receivedValue = ''
  parent.addEventListener('change', (event: any) => {
    receivedValue = event.target.value
  })

  DispatchChangeEvent.dispatchChangeEvent(input, window)

  expect(receivedValue).toBe('#ff0000')
})
