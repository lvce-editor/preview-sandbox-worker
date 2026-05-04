import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-context-global'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-context-global.html`
  const html = `<!DOCTYPE html>
<html>
<body>
  <canvas id="canvas" width="64" height="64"></canvas>
  <div id="status">pending</div>
  <script>
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const isCanvasContext = context instanceof CanvasRenderingContext2D
    document.getElementById('status').textContent = isCanvasContext ? 'ready' : 'wrong-context'
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const status = previewArea.locator('#status')
  await expect(status).toHaveText('ready')
}
