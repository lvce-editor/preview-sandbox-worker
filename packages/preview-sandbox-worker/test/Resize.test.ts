import { afterEach, expect, test } from '@jest/globals'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import { resize } from '../src/parts/Resize/Resize.ts'
import * as UpdateContent from '../src/parts/UpdateContent/UpdateContent.ts'

afterEach(() => {
  HappyDomState.clear()
})

test('resize updates viewport globals and dispatches the window resize event', async () => {
  const uid = 7
  const content = '<body><span id="width"></span></body>'
  const scripts = [
    `
      const updateWidth = () => {
        document.getElementById('width').textContent = String(window.innerWidth)
      }
      window.addEventListener('resize', updateWidth)
      updateWidth()
    `,
  ]
  await UpdateContent.updateContent(uid, 926, 600, content, scripts)

  const before = HappyDomState.get(uid)
  expect(before?.document.querySelector('#width')?.textContent).toBe('926')

  resize(uid, { height: 600, width: 400 })

  const after = HappyDomState.get(uid)
  expect(after?.window.innerWidth).toBe(400)
  expect(after?.window.innerHeight).toBe(600)
  expect(after?.document.querySelector('#width')?.textContent).toBe('400')
})
