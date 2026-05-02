/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { afterEach, expect, test } from '@jest/globals'
import { PreviewWorker } from '@lvce-editor/rpc-registry'
import { Window, type Document } from 'happy-dom-without-node'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as ObserveDom from '../src/parts/ObserveDom/ObserveDom.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

afterEach(() => {
  ObserveDom.disconnect(1)
  HappyDomState.remove(1)
})

type SetupScript = (window: Window, document: Document) => void

const setupHappyDomWithObserver = (uid: number, html: string, scripts: readonly SetupScript[] = []): any => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = html

  for (const runScript of scripts) {
    runScript(window, document)
  }

  const elementMap = Object.create(null)
  SerializeHappyDom.serialize(document, elementMap)
  HappyDomState.set(uid, { document, elementMap, window })

  ObserveDom.observe(uid, document, window)

  return { document, window }
}

const waitForMutationObserver = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 50)
  })
}

test('observe should detect childList mutations and trigger preview update', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  const container = document.querySelector('#container')
  const span = document.createElement('span')
  span.textContent = 'dynamic content'
  container.append(span)

  await waitForMutationObserver()

  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('observe should detect attribute mutations and trigger preview update', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="target"></div></body>')

  const target = document.querySelector('#target')
  target.setAttribute('class', 'highlighted')

  await waitForMutationObserver()

  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('observe should detect characterData mutations and trigger preview update', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="text">original</div></body>')

  const textDiv = document.querySelector('#text')
  textDiv.textContent = 'changed'

  await waitForMutationObserver()

  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('observe should update HappyDomState with newly added elements', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  const container = document.querySelector('#container')
  const p = document.createElement('p')
  p.textContent = 'new paragraph'
  container.append(p)

  await waitForMutationObserver()

  const elementMapValues = Object.values(HappyDomState.get(1)!.elementMap)
  expect(elementMapValues).toContain(p)
  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('observe should update HappyDomState elementMap', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  const elementMapBefore = HappyDomState.get(1)!.elementMap

  const container = document.querySelector('#container')
  const span = document.createElement('span')
  container.append(span)

  await waitForMutationObserver()

  const elementMapAfter = HappyDomState.get(1)!.elementMap
  expect(elementMapAfter).not.toBe(elementMapBefore)
  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('observe should detect mutations from setTimeout in user scripts', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  setupHappyDomWithObserver(1, '<body><div id="container">initial</div></body>', [
    (window, document): void => {
      window.setTimeout(() => {
        const el = document.querySelector('#container')!
        el.textContent = 'updated after timeout'
      }, 10)
    },
  ])

  await new Promise((resolve) => {
    setTimeout(resolve, 100)
  })

  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('disconnect should stop observing mutations', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  ObserveDom.disconnect(1)

  const container = document.querySelector('#container')
  const span = document.createElement('span')
  container.append(span)

  await waitForMutationObserver()

  expect(mockRpc.invocations).toEqual([])
})

test('observe should replace existing observer for same uid', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document, window } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  // Observe again (should replace)
  ObserveDom.observe(1, document, window)

  const container = document.querySelector('#container')
  const span = document.createElement('span')
  container.append(span)

  await waitForMutationObserver()

  // Should still work, not fire twice
  expect(mockRpc.invocations).toEqual([['Preview.handleMutation', 1]])
})

test('observe should not throw when HappyDomState is missing during mutation', async () => {
  using mockRpc = PreviewWorker.registerMockRpc({ 'Preview.handleMutation': () => {} })
  const { document } = setupHappyDomWithObserver(1, '<body><div id="container"></div></body>')

  // Remove the happy dom state
  HappyDomState.remove(1)

  const container = document.querySelector('#container')
  const span = document.createElement('span')
  container.append(span)

  await waitForMutationObserver()

  // Should not call rerender since there's no happy dom state
  expect(mockRpc.invocations).toEqual([])
})
