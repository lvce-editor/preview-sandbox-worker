import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/constants'
import { Window } from 'happy-dom-without-node'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

test('serialize should serialize canvas element with Canvas type when no __canvasId', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const elementMap = new Map<string, any>()
  const result = SerializeHappyDom.serialize(document, elementMap)
  const canvasNode = result.dom.find((node: any) => node.type === VirtualDomElements.Canvas)
  expect(canvasNode).toBeDefined()
  expect((canvasNode as any).width).toBe('320')
  expect((canvasNode as any).height).toBe('480')
  expect((canvasNode as any).id).toBe('game')
})

test('serialize should emit Reference node for canvas element with __canvasId', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const canvas = document.querySelector('canvas') as any
  canvas.__canvasId = 42
  const elementMap = new Map<string, any>()
  const result = SerializeHappyDom.serialize(document, elementMap)
  const refNode = result.dom.find((node: any) => node.type === VirtualDomElements.Reference)
  expect(refNode).toBeDefined()
  expect((refNode as any).uid).toBe(42)
  expect((refNode as any).childCount).toBe(0)
})

test('serialize should not emit Canvas node when __canvasId is set', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const canvas = document.querySelector('canvas') as any
  canvas.__canvasId = 1
  const elementMap = new Map<string, any>()
  const result = SerializeHappyDom.serialize(document, elementMap)
  const canvasNode = result.dom.find((node: any) => node.type === VirtualDomElements.Canvas)
  expect(canvasNode).toBeUndefined()
})

test('serialize should assign data-id to canvas element for event tracking', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const elementMap = new Map<string, any>()
  const result = SerializeHappyDom.serialize(document, elementMap)
  const canvasNode = result.dom.find((node: any) => node.type === VirtualDomElements.Canvas)
  expect((canvasNode as any)['data-id']).toBeDefined()
  expect(elementMap.size).toBeGreaterThan(0)
})
