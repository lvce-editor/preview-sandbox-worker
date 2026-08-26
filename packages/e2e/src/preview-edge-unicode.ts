/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-unicode'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-unicode.html`
  const html = '<!doctype html><html><body><p id="unicode">Zażółć gęślą jaźń · 你好 · مرحبا · 👩🏽‍💻</p></body></html>'
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#unicode')).toHaveText('Zażółć gęślą jaźń · 你好 · مرحبا · 👩🏽‍💻')
}
