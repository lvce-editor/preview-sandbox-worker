import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-multiple-scripts'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-multiple-scripts.html`
  const html = `<!doctype html><html><body><p id="result">pending</p>
      <script>window.previewSteps = ['first']</script>
      <script>window.previewSteps.push('second')</script>
      <script>document.getElementById('result').textContent = window.previewSteps.join(',')</script>
    </body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#result')).toHaveText('first,second')
}
