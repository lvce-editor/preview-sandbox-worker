import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-insert-adjacent-html'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-insert-adjacent-html.html`
  const html = `<!doctype html><html><body><div id="target"><span id="middle">middle</span></div><script>
      const middle = document.getElementById('middle')
      middle.insertAdjacentHTML('beforebegin', '<span id="before">before</span>')
      middle.insertAdjacentHTML('afterend', '<span id="after">after</span>')
    </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const children = preview.locator('#target span')
  const firstChild = children.nth(0)
  const secondChild = children.nth(1)
  const thirdChild = children.nth(2)
  await expect(children).toHaveCount(3)
  await expect(firstChild).toHaveText('before')
  await expect(secondChild).toHaveText('middle')
  await expect(thirdChild).toHaveText('after')
}
