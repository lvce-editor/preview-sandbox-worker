import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.input-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-keydown.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Input Event Test</title>
</head>
<body>
  <input type="text" id="textInput" placeholder="Type here">
  <p id="output">No input received</p>

  <script>
    document.getElementById('textInput').addEventListener('input', function(event) {
      document.getElementById('output').textContent = 'input received'
    });
  </script>
</body>
</html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const input = previewArea.locator('#textInput')
  const output = previewArea.locator('#output')
  await expect(input).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toHaveText('No input received')

  // act
  await Command.execute('Preview.handleInput', '0', 'a')

  // assert
  await expect(output).toHaveText('input received')
}
