import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleChange from '../src/parts/HandleChange/HandleChange.ts'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'

afterEach(() => {
  HappyDomState.clear()
})

test('handleChange updates a color input and runs its change listener', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<h1 id="text">Hello World</h1><input id="colorPicker" type="color" value="#ff0000">'
  const text = document.querySelector('#text') as any
  const colorPicker = document.querySelector('#colorPicker') as any
  colorPicker.addEventListener('change', (event: any) => {
    text.style.color = event.target.value
  })
  HappyDomState.set(uid, {
    document,
    elementMap: { 1: colorPicker },
    window,
  })

  await HandleChange.handleChange(uid, '1', '#00ff00')

  expect(colorPicker.value).toBe('#00ff00')
  expect(text.style.color).toBe('#00ff00')
})

test('handleInput keeps the target available for repeated change events', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<input id="colorPicker" type="text">'
  const input = document.querySelector('#colorPicker') as any
  const values: string[] = []
  input.onchange = (event: any): void => {
    values.push(event.target.value)
  }
  HappyDomState.set(uid, {
    document,
    elementMap: { 1: input },
    window,
  })

  await HandleInput.handleInput(uid, '1', 'red')
  await HandleChange.handleChange(uid, '1', 'red')
  await HandleInput.handleInput(uid, '1', 'blue')
  await HandleChange.handleChange(uid, '1', 'blue')

  expect(values).toEqual(['red', 'blue'])
})

test('handleChange invokes property and registered listeners once', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<input id="textInput" type="text">'
  const input = document.querySelector('#textInput') as any
  const values: string[] = []
  input.onchange = (event: any): void => {
    values.push(`property:${event.target.value}`)
  }
  input.addEventListener('change', (event: any): void => {
    values.push(`listener:${event.target.value}`)
  })
  HappyDomState.set(uid, {
    document,
    elementMap: { 1: input },
    window,
  })

  await HandleChange.handleChange(uid, '1', 'red')

  expect(values).toEqual(['property:red', 'listener:red'])
})
