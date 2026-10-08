import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleKeydown from '../src/parts/HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../src/parts/HandleKeyup/HandleKeyup.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'

afterEach(() => {
  HappyDomState.clear()
})

test('repeated keyboard events keep targeting the same element', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  const canvas = document.createElement('canvas')
  document.body.append(canvas)
  HappyDomState.set(uid, {
    document,
    elementMap: { canvas },
    window,
  })

  const events: string[] = []
  window.addEventListener('keydown', (event: any) => {
    events.push(`down:${event.code}`)
  })
  window.addEventListener('keyup', (event: any) => {
    events.push(`up:${event.code}`)
  })

  await HandleKeydown.handleKeydown(uid, 'canvas', ' ', 'event.code')
  await HandleKeyup.handleKeyup(uid, 'canvas', ' ', 'event.code')
  await HandleKeydown.handleKeydown(uid, 'canvas', ' ', 'event.code')

  expect(events).toEqual(['down:Space', 'up:Space', 'down:Space'])
})
