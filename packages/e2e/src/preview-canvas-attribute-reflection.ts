import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-attribute-reflection'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-attribute-reflection.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Canvas Attribute Reflection Test</title>
</head>
<body>
  <h2>Canvas Attribute Reflection Test</h2>
  <canvas id="gameCanvas" width="200" height="150"></canvas>
  <div id="propertyWidth"></div>
  <div id="propertyHeight"></div>
  <div id="attributeWidth"></div>
  <div id="attributeHeight"></div>

  <script>
    const canvas = document.getElementById('gameCanvas')
    canvas.width = 400
    canvas.height = 300

    document.getElementById('propertyWidth').textContent = String(canvas.width)
    document.getElementById('propertyHeight').textContent = String(canvas.height)
    document.getElementById('attributeWidth').textContent = String(canvas.getAttribute('width'))
    document.getElementById('attributeHeight').textContent = String(canvas.getAttribute('height'))
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  const heading = previewArea.locator('h2')
  const canvas = previewArea.locator('#gameCanvas')
  const propertyWidth = previewArea.locator('#propertyWidth')
  const propertyHeight = previewArea.locator('#propertyHeight')
  const attributeWidth = previewArea.locator('#attributeWidth')
  const attributeHeight = previewArea.locator('#attributeHeight')

  await expect(previewArea).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(heading).toHaveText('Canvas Attribute Reflection Test')
  await expect(propertyWidth).toHaveText('400')
  await expect(propertyHeight).toHaveText('300')
  await expect(attributeWidth).toHaveText('400')
  await expect(attributeHeight).toHaveText('300')
  await expect(canvas).toHaveAttribute('id', 'gameCanvas')
  await expect(canvas).toHaveAttribute('width', '400')
  await expect(canvas).toHaveAttribute('height', '300')
}
