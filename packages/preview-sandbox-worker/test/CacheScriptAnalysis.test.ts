import { expect, jest, test } from '@jest/globals'
import { cacheScriptAnalysis } from '../src/parts/CacheScriptAnalysis/CacheScriptAnalysis.ts'

test('reuses fixed scripts while analyzing edited text', () => {
  const analyze = jest.fn((script: string) => script.length)
  const cached = cacheScriptAnalysis(analyze)
  for (let index = 0; index < 20; index++) {
    expect(cached('library')).toBe(7)
    expect(cached(`scene ${index}`)).toBe(`scene ${index}`.length)
  }
  expect(analyze.mock.calls.filter((call: readonly [string]) => call[0] === 'library')).toHaveLength(1)
  expect(analyze).toHaveBeenCalledTimes(21)
})

test('evicts the least recently used result at the byte budget', () => {
  const analyze = jest.fn((script: string) => script)
  const cached = cacheScriptAnalysis(analyze, 8)
  cached('a')
  cached('bb')
  cached('a')
  cached('ccc')
  cached('bb')
  expect(analyze.mock.calls.map((call: readonly [string]) => call[0])).toEqual(['a', 'bb', 'ccc', 'bb'])
})

test('oversized scripts are analyzed without displacing cached results', () => {
  const analyze = jest.fn((script: string) => script)
  const cached = cacheScriptAnalysis(analyze, 4)
  cached('a')
  cached('oversized')
  cached('oversized')
  cached('a')
  expect(analyze).toHaveBeenCalledTimes(3)
})
