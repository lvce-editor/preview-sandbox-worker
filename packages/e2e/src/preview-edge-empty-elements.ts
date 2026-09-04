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
  await expect(preview.locator('#empty')).toHaveCount(1)
  await expect(preview.locator('hr')).toHaveCount(1)
  await expect(preview.locator('#after')).toHaveText('after')
  await expect(preview.locator('#last')).toHaveText('last')
}
