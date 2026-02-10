import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should load content and preserve state properties', async () => {
  const state: PreviewState = { ...createDefaultState(), uid: 1 }
  const result = await LoadContent.loadContent(state)

  expect(result.uid).toBe(1)
  expect(result.assetDir).toBeDefined()
  expect(result.initial).toBeDefined()
  expect(result.platform).toBeDefined()
  expect(result.errorCount).toBe(0)
})
