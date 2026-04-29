import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleMouseleave from '../src/parts/HandleMouseleave/HandleMouseleave.ts'
import * as HandlePointerdown from '../src/parts/HandlePointerdown/HandlePointerdown.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

interface CoordinatesEvent {
  readonly clientX: number
  readonly clientY: number
  readonly type: string
}

interface PointerCoordinatesEvent extends CoordinatesEvent {
  readonly pointerType?: string
}

afterEach(() => {
  HappyDomState.clear()
})

const getHdId = (elementMap: Readonly<Record<string, unknown>>, element: unknown): string => {
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
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  target.addEventListener('mouseleave', (event) => {
    const mouseEvent = event as unknown as CoordinatesEvent
    received = {
      clientX: mouseEvent.clientX,
      clientY: mouseEvent.clientY,
      type: mouseEvent.type,
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
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  target.addEventListener('pointerdown', (event) => {
    const { clientX: nextClientX, clientY: nextClientY, pointerType: nextPointerType } = event as unknown as PointerCoordinatesEvent
    pointerType = nextPointerType || 'mouse'
    clientX = nextClientX
    clientY = nextClientY
  })

  await HandlePointerdown.handlePointerdown(uid, hdId, 28, 19, 8, 9)

  expect(pointerType).toBe('mouse')
  expect(clientX).toBe(20)
  expect(clientY).toBe(10)
})
