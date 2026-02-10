import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Alert from '../src/parts/Alert/Alert.ts'

test('alert - calls RendererWorker.invoke with ConfirmPrompt.prompt', () => {
  using mockRpc = RendererWorker.registerMockRpc({ 'ConfirmPrompt.prompt': () => {} })
  Alert.alert('hello')
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'hello']])
})

test('alert - passes the message string', () => {
  using mockRpc = RendererWorker.registerMockRpc({ 'ConfirmPrompt.prompt': () => {} })
  Alert.alert('something went wrong')
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'something went wrong']])
})

test('alert - handles empty message', () => {
  using mockRpc = RendererWorker.registerMockRpc({ 'ConfirmPrompt.prompt': () => {} })
  Alert.alert('')
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', '']])
})
