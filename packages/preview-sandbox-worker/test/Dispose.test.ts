import { afterEach, expect, jest, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import { patchCanvasElement } from '../src/parts/PatchCanvasElements/PatchCanvasElements.ts'
import * as RuntimeDiagnostics from '../src/parts/RuntimeDiagnostics/RuntimeDiagnostics.ts'

afterEach(() => {
  CanvasState.clear()
  HappyDomState.clear()
  RuntimeDiagnostics.clearAll()
  jest.restoreAllMocks()
})

test('closing one preview releases its context and animation without stopping other previews', () => {
  const clearTimeout = jest.spyOn(globalThis, 'clearTimeout')
  const loseContext = jest.fn()
  for (const uid of [1, 2]) {
    const window = new Window()
    const canvas = window.document.createElement('canvas') as any
    const offscreenCanvas = {
      getContext: (): unknown => ({
        getExtension: (): unknown => ({
          loseContext: (): void => {
            loseContext(uid)
          },
        }),
      }),
      height: 300,
      width: 300,
    } as unknown as OffscreenCanvas
    patchCanvasElement(canvas, uid, { canvasId: uid, offscreenCanvas })
    canvas.getContext('webgl2')
    CanvasState.addAnimationFrameHandle(uid, uid)
    HappyDomState.set(uid, { document: window.document, elementMap: {}, window })
    RuntimeDiagnostics.addException(uid, new Error('preview error'))
  }
  dispose(1)
  dispose(1)
  expect(loseContext.mock.calls).toEqual([[1]])
  expect(clearTimeout.mock.calls).toEqual([[1]])
  expect(CanvasState.get(1)).toBeUndefined()
  expect(HappyDomState.get(1)).toBeUndefined()
  expect(RuntimeDiagnostics.getRuntimeDiagnostics(1).entries).toEqual([])
  expect(CanvasState.get(2)).toBeDefined()
  expect(HappyDomState.get(2)).toBeDefined()
  expect(RuntimeDiagnostics.getRuntimeDiagnostics(2).errorCount).toBe(1)
})
