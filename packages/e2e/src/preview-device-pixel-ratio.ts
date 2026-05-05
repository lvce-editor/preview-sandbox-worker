import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.device-pixel-ratio'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-device-pixel-ratio.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Device Pixel Ratio Test</title>
</head>
<body>
  <h1>Device Pixel Ratio</h1>
  <canvas id="canvas" width="64" height="32"></canvas>
  <p id="ratio">pending</p>
  <p id="size">pending</p>

  <script>
    const canvas = document.getElementById('canvas');
    const ratio = window.devicePixelRatio;
    const targetWidth = Math.floor(canvas.width * ratio);
    const targetHeight = Math.floor(canvas.height * ratio);

    document.getElementById('ratio').textContent = String(ratio);
    document.getElementById('size').textContent = targetWidth + 'x' + targetHeight;
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  const ratio = previewArea.locator('#ratio')
  const size = previewArea.locator('#size')
  await expect(ratio).toHaveText('1')
  await expect(size).toHaveText('64x32')
}