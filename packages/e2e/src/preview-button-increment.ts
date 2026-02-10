import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.button-increment'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}preview-test-button-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Button Increment Test</title>
</head>
<body>
  <p>Count: <span id="count">0</span></p>
  <button id="incrementBtn">Increment</button>

  <script>
    let count = 0;
    document.getElementById('incrementBtn').addEventListener('click', function() {
      count++;
      document.getElementById('count').textContent = count;
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const countSpan = previewArea.locator('#count')
  await expect(countSpan).toBeVisible()
  await expect(countSpan).toContainText('0')

  // act
  await Command.execute('Preview.handleClick', '2')

  // assert
  await expect(countSpan).toContainText('1')
}
