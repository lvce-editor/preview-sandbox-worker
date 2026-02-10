import { expect, test, beforeEach } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as HandleInput from '../src/parts/HandleInput/HandleInput.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

const createState = (uid: number): any => {
  return {
    css: [],
    initial: false,
    parsedDom: [],
    parsedNodesChildNodeCount: [],
    sandboxRpc: null,
    scrollLeft: 0,
    scrollTop: 0,
    uid,
    uri: '',
    useSandboxWorker: false,
    zoom: 1,
  }
}

const setupHappyDom = (uid: number, html: string): void => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = html

  const elementMap = new Map<string, any>()
  SerializeHappyDom.serialize(document, elementMap)

  HappyDomState.set(uid, {
    document,
    elementMap,
    window,
  })
}

beforeEach(() => {
  HappyDomState.clear()
})

test('handleInput returns state when hdId is empty', async () => {
  const state = createState(1)
  const result = await HandleInput.handleInput(state, '', '')
  expect(result).toEqual(state)
})

test('handleInput returns state when happyDomInstance is not found', async () => {
  const state = createState(999)
  const result = await HandleInput.handleInput(state, 'some-id', 'value')
  expect(result).toEqual(state)
})

test('handleInput returns state when element is not found', async () => {
  const html = '<input id="input" type="text">'
  setupHappyDom(1, html)
  const state = createState(1)
  const result = await HandleInput.handleInput(state, 'non-existent-id', 'value')
  expect(result).toEqual(state)
})

test('handleInput fires input event listener on element', async () => {
  const html = '<input id="input" type="text">'
  setupHappyDom(1, html)

  const happyDomInstance = HappyDomState.get(1)!
  let inputFired = false
  for (const [, element] of happyDomInstance.elementMap) {
    if (element.id === 'input') {
      element.addEventListener('input', () => {
        inputFired = true
      })
    }
  }

  const state = createState(1)
  await HandleInput.handleInput(
    state,
    [...happyDomInstance.elementMap.keys()].find((id) => happyDomInstance.elementMap.get(id)!.id === 'input')!,
    'test value',
  )

  expect(inputFired).toBe(true)
})

test('handleInput returns new state with updated parsedDom', async () => {
  const html = '<input id="input" type="text" value="old">'
  setupHappyDom(1, html)

  const happyDomInstance = HappyDomState.get(1)!
  let inputHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'input') {
      inputHdId = hdId
      element.addEventListener('input', function (this: any) {
        this.value = 'new'
      })
    }
  }

  const state = createState(1)
  const result = await HandleInput.handleInput(state, inputHdId, 'updated value')

  expect(result).not.toEqual(state)
  expect(result.parsedDom).toEqual(expect.anything())
  expect(result.css).toEqual(expect.anything())
})

test('handleInput updates element value from input parameter', async () => {
  const html = '<input id="input" type="text" value="initial">'
  setupHappyDom(1, html)

  const happyDomInstance = HappyDomState.get(1)!
  let inputHdId = ''
  let valueInListener = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'input') {
      inputHdId = hdId
      element.addEventListener('input', function (this: any) {
        valueInListener = this.value
      })
    }
  }

  const state = createState(1)
  await HandleInput.handleInput(state, inputHdId, 'new input value')

  expect(valueInListener).toBe('new input value')
})
