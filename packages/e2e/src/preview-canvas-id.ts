import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-id'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-id.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <canvas id="gameCanvas" width="300" height="150"></canvas>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const canvas = previewArea.locator('#gameCanvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('id', 'gameCanvas')
}
