import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.basic-html'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-basic.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Basic HTML Test</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  // act
  await Command.execute('Layout.showPreview', filePath)

  // assert
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const heading = previewArea.locator('h1')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Hello World')
}
