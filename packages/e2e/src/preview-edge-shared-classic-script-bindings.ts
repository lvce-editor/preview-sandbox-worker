import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-shared-classic-script-bindings'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Preview, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-shared-classic-script-bindings.html`
  const html = `<!doctype html><html><body><p id="result">pending</p>
      <script>var Landscape = function () { this.name = 'landscape' }</script>
      <script>var landscape = new Landscape(); document.getElementById('result').textContent = landscape.name</script>
      <button id="walk" onclick="landscape.name = 'walking'; document.getElementById('result').textContent = landscape.name">Walk</button>
    </body></html>`
  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const result = preview.locator('#result')
  await expect(result).toHaveText('landscape')
  await Preview.handleClick('1')
  await expect(result).toHaveText('walking')
}
