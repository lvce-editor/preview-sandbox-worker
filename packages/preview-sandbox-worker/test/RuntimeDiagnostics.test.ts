import { afterEach, expect, jest, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as RuntimeDiagnostics from '../src/parts/RuntimeDiagnostics/RuntimeDiagnostics.ts'

afterEach(() => {
  RuntimeDiagnostics.clearAll()
  jest.restoreAllMocks()
})

test('captures console messages for a preview', () => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  const window = new Window()
  const runtimeConsole = RuntimeDiagnostics.install(7, window)
  const circular: Record<string, unknown> = { value: 1 }
  circular.self = circular

  runtimeConsole.log('ready', circular)

  expect(RuntimeDiagnostics.getRuntimeDiagnostics(7)).toEqual({
    entries: [
      {
        level: 'log',
        message: 'ready {"value":1,"self":"[Circular]"}',
        type: 'console',
      },
    ],
    errorCount: 0,
  })
})

test('captures uncaught event listener exceptions', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const window = new Window()
  RuntimeDiagnostics.install(9, window)
  const button = window.document.createElement('button')
  button.addEventListener('click', () => {
    throw new ReferenceError('addPipe is not defined')
  })

  button.dispatchEvent(new window.Event('click'))

  expect(RuntimeDiagnostics.getRuntimeDiagnostics(9)).toMatchObject({
    entries: [
      {
        level: 'error',
        message: 'addPipe is not defined',
        type: 'exception',
      },
    ],
    errorCount: 1,
  })
})

test('clears diagnostics independently for each preview', () => {
  RuntimeDiagnostics.addException(1, new Error('first'))
  RuntimeDiagnostics.addException(2, new Error('second'))

  RuntimeDiagnostics.clear(1)

  expect(RuntimeDiagnostics.getRuntimeDiagnostics(1).entries).toEqual([])
  expect(RuntimeDiagnostics.getRuntimeDiagnostics(2).entries).toHaveLength(1)
})
