import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.mousedown-event'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-mousedown-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Mousedown Event Test</title>
</head>
<body>
  <button id="testButton">Click me</button>
  <p id="output">No mousedown detected</p>

  <script>
    document.getElementById('testButton').addEventListener('mousedown', function(event) {
      document.getElementById('output').textContent = 'Mousedown detected on button';
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const button = previewArea.locator('#testButton')
  const output = previewArea.locator('#output')
  await expect(button).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toHaveText('No mousedown detected')

  // act
  await Command.execute('Preview.handleMouseDown', '1')

  // assert
  await expect(output).toHaveText('Mousedown detected on button')
}
