import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchInputEvent from '../src/parts/DispatchInputEvent/DispatchInputEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchInputEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<input id="input" type="text">'
  const input = document.querySelector('#input')
  let inputEvent = false
  input.addEventListener('input', () => {
    inputEvent = true
  })
  DispatchInputEvent.dispatchInputEvent(input, window)
  expect(inputEvent).toBe(true)
})

test('dispatchInputEvent fires direct oninput handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<input id="input" type="text">'
  const input = document.querySelector('#input')
  let inputEvent = false
  input.oninput = (): void => {
    inputEvent = true
  }
  DispatchInputEvent.dispatchInputEvent(input, window)
  expect(inputEvent).toBe(true)
})

test('dispatchInputEvent fires both addEventListener and oninput', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<input id="input" type="text">'
  const input = document.querySelector('#input')
  const calls: string[] = []
  input.addEventListener('input', (): void => {
    calls.push('addEventListener')
  })
  input.oninput = (): void => {
    calls.push('oninput')
  }
  DispatchInputEvent.dispatchInputEvent(input, window)
  expect(calls).toContain('addEventListener')
  expect(calls).toContain('oninput')
})

test('dispatchInputEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<input id="input" type="text">'
  const input = document.querySelector('#input')
  expect(() => {
    DispatchInputEvent.dispatchInputEvent(input, window)
  }).not.toThrow()
})
