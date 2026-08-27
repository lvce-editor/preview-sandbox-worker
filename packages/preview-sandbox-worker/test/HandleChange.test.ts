import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleChange from '../src/parts/HandleChange/HandleChange.ts'
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
