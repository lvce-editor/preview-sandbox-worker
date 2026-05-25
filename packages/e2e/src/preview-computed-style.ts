import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.computed-style'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-computed-style.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Computed Style Test</title>
  <style>
    :root {
      --grid: rgba(255,255,255,0.07);
    }
  </style>
</head>
<body>
  <h2>Computed Style Test</h2>
  <div id="type"></div>
  <div id="result"></div>

  <script>
    document.getElementById('type').textContent = typeof getComputedStyle
    document.getElementById('result').textContent = getComputedStyle(document.documentElement).getPropertyValue('--grid').trim()
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)

  const previewArea = Locator('.Viewlet.Preview')
  const heading = previewArea.locator('h2')
  const type = previewArea.locator('#type')
  const result = previewArea.locator('#result')

  await expect(previewArea).toBeVisible()
  await expect(heading).toHaveText('Computed Style Test')
  await expect(type).toHaveText('function')
  await expect(result).toHaveText('rgba(255,255,255,0.07)')
}
