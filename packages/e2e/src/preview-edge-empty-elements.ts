import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-empty-elements'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-empty-elements.html`
  const html = '<!doctype html><html><body><div id="empty"></div><span id="after">after</span><hr><span id="last">last</span></body></html>'
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const empty = preview.locator('#empty')
  await expect(empty).toHaveCount(1)
  const separator = preview.locator('hr')
  await expect(separator).toHaveCount(1)
  const after = preview.locator('#after')
  await expect(after).toHaveText('after')
  const last = preview.locator('#last')
  await expect(last).toHaveText('last')
}
