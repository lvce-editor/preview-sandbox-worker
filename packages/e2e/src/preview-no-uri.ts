import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.no-uri'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Command.execute('Layout.showPreview', '')

  // assert
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
}
