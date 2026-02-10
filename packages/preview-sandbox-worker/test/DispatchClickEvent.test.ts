import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchClickEvent from '../src/parts/DispatchClickEvent/DispatchClickEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchClickEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  let clicked = false
  button.addEventListener('click', () => {
    clicked = true
  })
  DispatchClickEvent.dispatchClickEvent(button, window)
  expect(clicked).toBe(true)
})

test('dispatchClickEvent fires direct onclick handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  let clicked = false
  button.onclick = (): void => {
    clicked = true
  }
  DispatchClickEvent.dispatchClickEvent(button, window)
  expect(clicked).toBe(true)
})

test('dispatchClickEvent fires both addEventListener and onclick', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  const calls: string[] = []
  button.addEventListener('click', (): void => {
    calls.push('addEventListener')
  })
  button.onclick = (): void => {
    calls.push('onclick')
  }
  DispatchClickEvent.dispatchClickEvent(button, window)
  expect(calls).toContain('addEventListener')
  expect(calls).toContain('onclick')
})

test('dispatchClickEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  expect(() => {
    DispatchClickEvent.dispatchClickEvent(button, window)
  }).not.toThrow()
})

test('dispatchClickEvent event bubbles to parent', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="parent"><button id="child">Click</button></div>'
  const parent = document.querySelector('#parent')
  const child = document.querySelector('#child')
  let bubbled = false
  parent.addEventListener('click', () => {
    bubbled = true
  })
  DispatchClickEvent.dispatchClickEvent(child, window)
  expect(bubbled).toBe(true)
})

test('dispatchClickEvent passes MouseEvent to onclick handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  let receivedEvent: any = null
  button.onclick = (event: any): void => {
    receivedEvent = event
  }
  DispatchClickEvent.dispatchClickEvent(button, window)
  expect(receivedEvent).toBeDefined()
  expect(receivedEvent.type).toBe('click')
})

test('dispatchClickEvent does not call onclick when it is not a function', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  button.onclick = 'not a function'
  expect(() => {
    DispatchClickEvent.dispatchClickEvent(button, window)
  }).not.toThrow()
})
