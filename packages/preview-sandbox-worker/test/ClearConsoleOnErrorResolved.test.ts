import { afterEach, expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ClearConsoleOnErrorResolved from '../src/parts/ClearConsoleOnErrorResolved/ClearConsoleOnErrorResolved.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as RuntimeDiagnostics from '../src/parts/RuntimeDiagnostics/RuntimeDiagnostics.ts'

afterEach(() => {
  ClearConsoleOnErrorResolved.clearAll()
  HappyDomState.clear()
  RuntimeDiagnostics.clearAll()
  jest.restoreAllMocks()
})

test('clears the console through the preview content update lifecycle', async () => {
  const clearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  using _mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': () => true,
  })

  await loadContent(1, 320, 240, '<body></body>', ['const value ='])
  await loadContent(1, 320, 240, '<body></body>', ['const value = 1'])

  expect(clearSpy).toHaveBeenCalledTimes(1)
})

test.each([new ReferenceError('missing is not defined'), new SyntaxError('Unexpected token')])(
  'clears the console when %s is resolved and the setting is enabled',
  async (error: Readonly<Error>) => {
    const clearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {})
    using _mockRpc = RendererWorker.registerMockRpc({
      'Preferences.get': (key: string) => {
        expect(key).toBe('preview.clearConsoleOnErrorResolved')
        return true
      },
    })

    await ClearConsoleOnErrorResolved.handle(1, error)
    await ClearConsoleOnErrorResolved.handle(1, null)

    expect(clearSpy).toHaveBeenCalledTimes(1)
  },
)

test('does not clear the console when the setting is disabled', async () => {
  const clearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {})
  using _mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': () => false,
  })

  await ClearConsoleOnErrorResolved.handle(1, new ReferenceError('missing is not defined'))
  await ClearConsoleOnErrorResolved.handle(1, null)

  expect(clearSpy).not.toHaveBeenCalled()
})

test('does not clear the console when another error type is resolved', async () => {
  const clearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {})

  await ClearConsoleOnErrorResolved.handle(1, new TypeError('invalid value'))
  await ClearConsoleOnErrorResolved.handle(1, null)

  expect(clearSpy).not.toHaveBeenCalled()
})

test('does not clear the console while a clearable error remains', async () => {
  const clearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {})

  await ClearConsoleOnErrorResolved.handle(1, new SyntaxError('Unexpected token'))
  await ClearConsoleOnErrorResolved.handle(1, new ReferenceError('missing is not defined'))

  expect(clearSpy).not.toHaveBeenCalled()
})

test('tracks errors independently for each preview', async () => {
  const clearSpy = jest.spyOn(console, 'clear').mockImplementation(() => {})
  using _mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': () => true,
  })

  await ClearConsoleOnErrorResolved.handle(1, new ReferenceError('missing is not defined'))
  await ClearConsoleOnErrorResolved.handle(2, null)
  expect(clearSpy).not.toHaveBeenCalled()

  await ClearConsoleOnErrorResolved.handle(1, null)
  expect(clearSpy).toHaveBeenCalledTimes(1)
})
