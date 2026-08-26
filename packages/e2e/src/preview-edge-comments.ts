import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-comments'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-comments.html`
  const html = `<!doctype html><html><body><div id="items"></div><script>
    const items = document.getElementById('items')
    const before = document.createElement('span')
    before.textContent = 'before'
    const comment = document.createComment('ignored <button>fake</button>')
    const after = document.createElement('span')
    after.textContent = 'after'
    items.append(before, comment, after)
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const items = preview.locator('#items span')
  const firstItem = items.nth(0)
  const secondItem = items.nth(1)
  await expect(items).toHaveCount(2)
  await expect(firstItem).toHaveText('before')
  await expect(secondItem).toHaveText('after')
  await expect(preview.locator('#items button')).toHaveCount(0)
}
