import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/constants'
import * as ElementTags from '../src/parts/ElementTags/ElementTags.ts'
import { getVirtualDomTag } from '../src/parts/GetVirtualDomTag/GetVirtualDomTag.ts'

test('getVirtualDomTag should return Canvas element for "canvas" tag', () => {
  const result = getVirtualDomTag(ElementTags.Canvas)
  expect(result).toBe(VirtualDomElements.Canvas)
})
