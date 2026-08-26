import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-boolean-attributes'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-boolean-attributes.html`
  const html = `<!doctype html><html><body><input id="choice" type="checkbox" checked disabled required><p id="result">pending</p><script>
    const choice = document.getElementById('choice')
    document.getElementById('result').textContent = [choice.checked, choice.disabled, choice.required].join(',')
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#choice')).toHaveCount(1)
  await expect(preview.locator('#result')).toHaveText('true,true,true')
}
