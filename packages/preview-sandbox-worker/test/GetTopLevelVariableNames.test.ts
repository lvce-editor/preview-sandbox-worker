import { expect, test } from '@jest/globals'
import { getTopLevelVariableNames } from '../src/parts/GetTopLevelVariableNames/GetTopLevelVariableNames.ts'

test('getTopLevelVariableNames returns top-level var declarations', () => {
  expect(getTopLevelVariableNames('var Landscape = function () {}; var other = 1')).toEqual(['Landscape', 'other'])
})

test('getTopLevelVariableNames supports destructured declarations and ignores nested vars', () => {
  const script = 'var { value, nested: [other] } = source; function run() { var local = 1 }'
  expect(getTopLevelVariableNames(script)).toEqual(['value', 'other'])
})

test('getTopLevelVariableNames ignores lexical declarations', () => {
  expect(getTopLevelVariableNames('const value = 1; let other = 2')).toEqual([])
})
