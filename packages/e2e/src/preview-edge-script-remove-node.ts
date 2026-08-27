import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-script-remove-node'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-script-remove-node.html`
  const html = `<!doctype html><html><body><div id="container"><span id="remove">remove</span><span id="keep">keep</span></div><script>
      document.getElementById('remove').remove()
    </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#remove')).toHaveCount(0)
  await expect(preview.locator('#keep')).toHaveText('keep')
  await expect(preview.locator('#container span')).toHaveCount(1)
}
