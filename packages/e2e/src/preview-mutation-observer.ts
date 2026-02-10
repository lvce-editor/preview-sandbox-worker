import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.mutation-observer'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-mutation-${Date.now()}.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Mutation Observer Test</title>
</head>
<body>
  <div id="content">Original content</div>
  <button id="updateBtn">Update DOM</button>

  <script>
    document.getElementById('updateBtn').addEventListener('click', function() {
      setTimeout(function() {
        document.getElementById('content').textContent = 'Updated content';
      }, 5);
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const contentDiv = previewArea.locator('#content')
  await expect(contentDiv).toBeVisible()
  await expect(contentDiv).toHaveText('Original content')

  // act
  await Command.execute('Preview.handleClick', '1')
  await new Promise((resolve) => setTimeout(resolve, 100))

  // assert
  await expect(contentDiv).toHaveText('Updated content')
}
