import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-document-fragment'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-document-fragment.html`
  const html = `<!doctype html><html><body><ul id="list"></ul><script>
      const fragment = document.createDocumentFragment()
      for (const label of ['one', 'two', 'three']) {
        const item = document.createElement('li')
        item.textContent = label
        fragment.append(item)
      }
      document.getElementById('list').append(fragment)
    </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const items = preview.locator('#list li')
  const firstItem = items.nth(0)
  const lastItem = items.nth(2)
  await expect(items).toHaveCount(3)
  await expect(firstItem).toHaveText('one')
  await expect(lastItem).toHaveText('three')
}
