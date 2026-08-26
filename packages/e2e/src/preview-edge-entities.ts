import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-entities'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-entities.html`
  const html = `<!doctype html><html><body><p id="entities">&lt;tag&gt; &amp; &quot;quoted&quot; &#39;single&#39; &copy;</p><p id="result">pending</p><script>
    document.getElementById('result').textContent = document.getElementById('entities').textContent
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#result')).toHaveText(`<tag> & "quoted" 'single' ©`)
}
