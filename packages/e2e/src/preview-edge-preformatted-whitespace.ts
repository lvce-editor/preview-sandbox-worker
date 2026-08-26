import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-preformatted-whitespace'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-preformatted-whitespace.html`
  const html = '<!doctype html><html><body><pre id="sample">first\n  second\n\tthird</pre></body></html>'
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#sample')).toHaveText('first\n  second\n\tthird')
}
