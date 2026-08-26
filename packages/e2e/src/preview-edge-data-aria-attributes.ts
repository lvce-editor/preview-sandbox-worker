import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-data-aria-attributes'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-data-aria-attributes.html`
  const html = `<!doctype html><html><body><button id="menu" data-state="expanded" data-index="0" aria-expanded="true" aria-label="Open menu">Menu</button><p id="result">pending</p><script>
    const menu = document.getElementById('menu')
    document.getElementById('result').textContent = [menu.dataset.state, menu.dataset.index, menu.getAttribute('aria-expanded'), menu.getAttribute('aria-label')].join('|')
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const button = preview.locator('#menu')
  await expect(button).toHaveAttribute('data-state', 'expanded')
  await expect(button).toHaveAttribute('data-index', '0')
  await expect(preview.locator('#result')).toHaveText('expanded|0|true|Open menu')
}
