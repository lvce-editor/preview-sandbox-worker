import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-multiple-style-blocks'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-multiple-style-blocks.html`
  const html = `<!doctype html><html><head><style>:root { --accent: red; }</style><style>:root { --accent: blue; }</style></head><body><p id="result">pending</p><script>
    document.getElementById('result').textContent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  await expect(preview.locator('#result')).toHaveText('blue')
}
