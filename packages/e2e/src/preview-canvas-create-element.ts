import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-create-element'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-create-element.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Dynamic Canvas Test</title>
  <style>
    canvas {
      display: block;
      width: 200px;
      height: 200px;
    }
  </style>
</head>
<body>
  <h2>Dynamic Canvas Test</h2>
  <div id="game"></div>
  <span id="pixel"></span>

  <script>
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    document.getElementById('game').appendChild(canvas);
    canvas.width = 200;
    canvas.height = 200;
    context.fillStyle = 'blue';
    context.fillRect(0, 0, 200, 200);
    const pixel = context.getImageData(100, 100, 1, 1).data;
    document.getElementById('pixel').textContent = pixel.join(',');
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  await expect(previewArea.locator('h2')).toContainText('Dynamic Canvas Test')

  const canvas = previewArea.locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '200')
  await expect(canvas).toHaveAttribute('height', '200')
  await expect(previewArea.locator('#pixel')).toHaveText('0,0,255,255')
}
