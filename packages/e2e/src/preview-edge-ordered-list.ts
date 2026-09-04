import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-ordered-list'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-ordered-list.html`
  const html = '<!doctype html><html><body><ol id="countdown" start="3" reversed><li>three</li><li value="1">one</li></ol></body></html>'
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const list = preview.locator('#countdown')
  await expect(list).toHaveAttribute('start', '3')
  await expect(list).toHaveAttribute('reversed', '')
  const items = list.locator('li')
  const secondItem = items.nth(1)
  await expect(items).toHaveCount(2)
  await expect(secondItem).toHaveAttribute('value', '1')
}
