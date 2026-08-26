import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-script-error-isolation'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-script-error-isolation.html`
  const html = `<!doctype html><html><body><p id="result">pending</p>
      <script>throw new Error('intentional edge-case error')</script>
      <script>document.getElementById('result').textContent = 'continued'</script>
    </body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#result')).toHaveText('continued')
}
