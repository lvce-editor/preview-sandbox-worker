import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleMouseleave from '../src/parts/HandleMouseleave/HandleMouseleave.ts'
import * as HandlePointerdown from '../src/parts/HandlePointerdown/HandlePointerdown.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

afterEach(() => {
  HappyDomState.clear()
})

const getHdId = (elementMap: Record<string, any>, element: any): string => {
  const hdId = Object.keys(elementMap).find((id) => {
    return elementMap[id] === element
  })
  if (!hdId) {
    throw new Error('expected element to have serialized hdId')
  }
  return hdId
}

test('handleMouseleave dispatches mouseleave with normalized coordinates', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<div id="target">Hover target</div>'
  const target = document.querySelector('#target')
  if (!target) {
    throw new Error('expected target element to exist')
  }

  const elementMap = Object.create(null)
  SerializeHappyDom.serialize(document, elementMap)
  const hdId = getHdId(elementMap, target)

  HappyDomState.set(uid, {
    document,
    elementMap,
    window,
  })

  let received: { type: string; clientX: number; clientY: number } | undefined
  target.addEventListener('mouseleave', (event) => {
    received = {
      clientX: event.clientX,
      clientY: event.clientY,
      type: event.type,
    }
  })

  await HandleMouseleave.handleMouseleave(uid, hdId, 44, 30, 14, 10)

  expect(received).toEqual({
    clientX: 30,
    clientY: 20,
    type: 'mouseleave',
  })
})

test('handlePointerdown dispatches pointerdown listeners', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<button id="target">Press</button>'
  const target = document.querySelector('#target')
  if (!target) {
    throw new Error('expected target element to exist')
  }

  const elementMap = Object.create(null)
  SerializeHappyDom.serialize(document, elementMap)
  const hdId = getHdId(elementMap, target)

  HappyDomState.set(uid, {
    document,
    elementMap,
    window,
  })

  let pointerType = ''
  let clientX = -1
  let clientY = -1
  target.addEventListener('pointerdown', (event: any) => {
    pointerType = event.pointerType || 'mouse'
    clientX = event.clientX
    clientY = event.clientY
  })

  await HandlePointerdown.handlePointerdown(uid, hdId, 28, 19, 8, 9)

  expect(pointerType).toBe('mouse')
  expect(clientX).toBe(20)
  expect(clientY).toBe(10)
})
