import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'
import * as HandleMousedown from '../src/parts/HandleMousedown/HandleMousedown.ts'
import * as HandleMousemove from '../src/parts/HandleMousemove/HandleMousemove.ts'
import * as HandleMouseup from '../src/parts/HandleMouseup/HandleMouseup.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

afterEach(() => {
  HappyDomState.clear()
})

test('mouse down/move/up should not break follow-up click dispatch', async () => {
  const uid = 1
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.body.innerHTML = '<button id="btn">Click</button>'
  const button = document.querySelector('#btn')
  if (!button) {
    throw new Error('expected button element to exist')
  }

  const elementMap = Object.create(null)
  SerializeHappyDom.serialize(document, elementMap)
  const hdId = Object.keys(elementMap).find((id) => {
    return elementMap[id] === button
  })

  expect(hdId).toBeDefined()
  if (!hdId) {
    throw new Error('expected button to have serialized hdId')
  }

  HappyDomState.set(uid, {
    document,
    elementMap,
    window,
  })

  let clicked = false
  button.addEventListener('click', () => {
    clicked = true
  })

  await HandleMousedown.handleMousedown(uid, hdId, 10, 10)
  await HandleMousemove.handleMousemove(uid, hdId, 11, 11, 0, 0)
  await HandleMouseup.handleMouseup(uid, hdId, 11, 11)
  await HandleClick.handleClick(uid, hdId, 11, 11)

  expect(clicked).toBe(true)
})
