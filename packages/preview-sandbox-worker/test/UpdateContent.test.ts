/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { afterEach, beforeAll, expect, test } from '@jest/globals'
import { PreviewWorker } from '@lvce-editor/rpc-registry'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import * as GeometryState from '../src/parts/GeometryState/GeometryState.ts'
import { executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as UpdateContent from '../src/parts/UpdateContent/UpdateContent.ts'

class MockOffscreenCanvas {
  width: number
  height: number
  readonly oncontextlost: ((this: any, ev: Readonly<Event>) => any) | null = null
  readonly oncontextrestored: ((this: any, ev: Readonly<Event>) => any) | null = null

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getContext(_type: string): any {
    return {
      fillRect: (): void => {},
    }
  }

  transferToImageBitmap(): any {
    return {}
  }

  async convertToBlob(): Promise<Blob> {
    return new Blob()
  }

  addEventListener(_type: string, _listener: any, _options?: Readonly<boolean | AddEventListenerOptions>): void {}

  removeEventListener(_type: string, _listener: any, _options?: Readonly<boolean | EventListenerOptions>): void {}

  dispatchEvent(_event: Readonly<Event>): boolean {
    return true
  }
}

beforeAll(() => {
  if (!('OffscreenCanvas' in globalThis)) {
    // @ts-ignore
    globalThis.OffscreenCanvas = MockOffscreenCanvas
  }
})

afterEach(() => {
  CanvasState.clear()
  GeometryState.clear()
  HappyDomState.clear()
})

test('updateContent should expose geometry snapshot rects during script execution', async () => {
  const uid = 1
  GeometryState.setGeometryBuffer(uid, GeometryState.createGeometryBuffer(16))
  GeometryState.setRect(uid, '0', {
    bottom: 193,
    height: 180,
    left: 11,
    right: 331,
    top: 13,
    width: 320,
    x: 11,
    y: 13,
  })

  using _mockRpc = PreviewWorker.registerMockRpc({
    'Preview.createOffscreenCanvas': (_previewUid: number, id: number) => {
      executeCallback(id, new MockOffscreenCanvas(320, 180), 7)
    },
  })

  const content = '<body><div id="wrap"><canvas id="game" width="320" height="180"></canvas></div></body>'
  const scripts = [
    `
    const wrap = document.getElementById('game').parentElement.getBoundingClientRect()
    window.__rect = JSON.stringify({
      bottom: wrap.bottom,
      height: wrap.height,
      left: wrap.left,
      right: wrap.right,
      top: wrap.top,
      width: wrap.width,
      x: wrap.x,
      y: wrap.y,
    })
    `,
  ]

  const result = await UpdateContent.updateContent(uid, 320, 180, content, scripts)
  expect(result.errorMessage).toBe('')

  const state = HappyDomState.get(uid)
  expect(state).toBeDefined()
  expect((state?.window as any).__rect).toBe(
    JSON.stringify({
      bottom: 193,
      height: 180,
      left: 11,
      right: 331,
      top: 13,
      width: 320,
      x: 11,
      y: 13,
    }),
  )
})
