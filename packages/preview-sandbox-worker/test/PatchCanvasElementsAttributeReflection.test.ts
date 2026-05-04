import { expect, test } from '@jest/globals'
import { PreviewWorker } from '@lvce-editor/rpc-registry'
import { Window } from 'happy-dom-without-node'
import { executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'
import * as PatchCanvasElements from '../src/parts/PatchCanvasElements/PatchCanvasElements.ts'

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

test('patchCanvasElements should reflect width and height property changes to attributes', async () => {
  if (!('OffscreenCanvas' in globalThis)) {
    // @ts-ignore
    globalThis.OffscreenCanvas = MockOffscreenCanvas
  }

  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="200" height="150"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)

  using _mockRpc = PreviewWorker.registerMockRpc({
    'Preview.createOffscreenCanvas': (_uid: number, id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })

  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('#game') as any

  canvas.width = 400
  canvas.height = 300

  expect(canvas.getAttribute('width')).toBe('400')
  expect(canvas.getAttribute('height')).toBe('300')
})
