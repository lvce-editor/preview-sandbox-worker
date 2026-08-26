import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-body-attributes'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-body-attributes.html`
  const html = `<!doctype html><html><body class="page compact" lang="de" dir="rtl"><p id="result">pending</p><script>
    const body = document.body
    document.getElementById('result').textContent = [body.className, body.getAttribute('lang'), body.getAttribute('dir')].join('|')
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const body = preview.locator('.Body')
  await expect(body).toHaveCount(1)
  await expect(preview.locator('#result')).toHaveText('page compact|de|rtl')
}
