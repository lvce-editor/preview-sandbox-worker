import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-link-attributes'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-link-attributes.html`
  const html =
    '<!doctype html><html><body><a id="download" href="./report.txt" rel="nofollow" download="report.txt" hreflang="en" target="_blank">download</a></body></html>'
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const link = preview.locator('#download')
  await expect(link).toHaveAttribute('href', './report.txt')
  await expect(link).toHaveAttribute('rel', 'nofollow')
  await expect(link).toHaveAttribute('download', 'report.txt')
  await expect(link).toHaveAttribute('hreflang', 'en')
  await expect(link).toHaveAttribute('target', '_blank')
}
