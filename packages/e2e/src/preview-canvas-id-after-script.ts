import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-id-after-script'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-id-after-script.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <canvas id="gameCanvas" width="200" height="150"></canvas>
  <div id="canvasIdValue"></div>
  <div id="canvasWidthValue"></div>
  <script>
    const canvas = document.getElementById('gameCanvas')
    const ctx = canvas.getContext('2d')
    ctx.fillRect(0, 0, 10, 10)
    canvas.width = 240
    document.getElementById('canvasIdValue').textContent = canvas.id
    document.getElementById('canvasWidthValue').textContent = String(canvas.width)
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  const canvas = previewArea.locator('#gameCanvas')
  const canvasIdValue = previewArea.locator('#canvasIdValue')
  const canvasWidthValue = previewArea.locator('#canvasWidthValue')

  await expect(previewArea).toBeVisible()
  await expect(canvas).toBeVisible()
  await expect(canvasIdValue).toHaveText('gameCanvas')
  await expect(canvasWidthValue).toHaveText('240')
  await expect(canvas).toHaveAttribute('id', 'gameCanvas')
  await expect(canvas).toHaveAttribute('width', '240')
}