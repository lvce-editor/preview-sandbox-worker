import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.add-event-listener-global'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Preview, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-add-event-listener-global.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Global addEventListener Test</title>
</head>
<body>
  <p id="status">no</p>

  <script>
    addEventListener('keydown', function() {
      document.getElementById('status').textContent = 'yes';
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const status = previewArea.locator('#status')
  await expect(status).toBeVisible()
  await expect(status).toHaveText('no')

  await Preview.handleKeyDown('0', 'a', '65')

  await expect(status).toHaveText('yes')
}
