import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import * as Create from '../src/parts/Create/Create.ts'
import * as PreviewStates from '../src/parts/PreviewStates/PreviewStates.ts'

test('create should store state with the given uid', async () => {
  const uid = 123
  await Create.create(uid, '', 0, 0, 0, 0, 0, '')
  const result = PreviewStates.get(uid)
  const { newState } = result
  const newStateTyped: PreviewState = newState
  const { oldState } = result
  const oldStateTyped: PreviewState = oldState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.uid).toBe(uid)
  expect(oldStateTyped).toBeDefined()
  expect(oldStateTyped.uid).toBe(uid)
})
