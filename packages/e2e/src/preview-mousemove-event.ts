import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.mousemove-event'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-mousemove-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Mousemove Event Test</title>
</head>
<body>
  <div id="trackArea" style="width: 200px; height: 200px; border: 1px solid black;">
    Hover over this area
  </div>
  <p id="output">Coordinates: none</p>

  <script>
    document.getElementById('trackArea').addEventListener('mousemove', function(event) {
      const x = event.clientX;
      const y = event.clientY;
      document.getElementById('output').textContent = 'Coordinates: ' + x + ', ' + y;
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const trackArea = previewArea.locator('#trackArea')
  const output = previewArea.locator('#output')
  await expect(trackArea).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toHaveText('Coordinates: none')

  // act
  await Command.execute('Preview.handleMouseMove', '0', '50', '75')

  // assert
  await expect(output).toContainText('Coordinates:')
}
