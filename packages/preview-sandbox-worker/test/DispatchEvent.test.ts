import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchEvent from '../src/parts/DispatchEvent/DispatchEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  let fired = false
  button.addEventListener('click', () => {
    fired = true
  })
  const event = new window.MouseEvent('click', { bubbles: true })
  DispatchEvent.dispatchEvent(button, event)
  expect(fired).toBe(true)
})

test('dispatchEvent fires direct on* handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  let fired = false
  button.onclick = (): void => {
    fired = true
  }
  const event = new window.MouseEvent('click', { bubbles: true })
  DispatchEvent.dispatchEvent(button, event)
  expect(fired).toBe(true)
})

test('dispatchEvent fires both addEventListener and on* handler', () => {
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
  const event = new window.MouseEvent('click', { bubbles: true })
  DispatchEvent.dispatchEvent(button, event)
  expect(calls).toContain('addEventListener')
  expect(calls).toContain('onclick')
})

test('dispatchEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  const event = new window.MouseEvent('click', { bubbles: true })
  expect(() => {
    DispatchEvent.dispatchEvent(button, event)
  }).not.toThrow()
})

test('dispatchEvent does not call on* handler when it is not a function', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  button.onclick = 'not a function'
  const event = new window.MouseEvent('click', { bubbles: true })
  expect(() => {
    DispatchEvent.dispatchEvent(button, event)
  }).not.toThrow()
})

test('dispatchEvent passes event to on* handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  let receivedEvent: any = null
  button.onclick = (event: any): void => {
    receivedEvent = event
  }
  const event = new window.MouseEvent('click', { bubbles: true })
  DispatchEvent.dispatchEvent(button, event)
  expect(receivedEvent).toBeDefined()
  expect(receivedEvent.type).toBe('click')
})

test('dispatchEvent event bubbles to parent', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="parent"><button id="child">Click</button></div>'
  const parent = document.querySelector('#parent')
  const child = document.querySelector('#child')
  let bubbled = false
  parent.addEventListener('click', () => {
    bubbled = true
  })
  const event = new window.MouseEvent('click', { bubbles: true })
  DispatchEvent.dispatchEvent(child, event)
  expect(bubbled).toBe(true)
})
