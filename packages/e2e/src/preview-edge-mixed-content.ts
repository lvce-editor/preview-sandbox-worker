import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-mixed-content'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-mixed-content.html`
  const html = '<!doctype html><html><body><p id="sentence">before <span>inside</span> after <code>end</code></p></body></html>'
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const sentence = preview.locator('#sentence')
  await expect(sentence).toHaveText('before inside after end')
  await expect(sentence.locator('span')).toHaveText('inside')
  await expect(sentence.locator('code')).toHaveText('end')
}
