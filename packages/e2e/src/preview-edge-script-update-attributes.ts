import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-script-update-attributes'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-script-update-attributes.html`
  const html = `<!doctype html><html><body><div id="target" class="before" data-state="idle">content</div><p id="result">pending</p><script>
      const target = document.getElementById('target')
      target.className = 'after ready'
      target.setAttribute('data-state', 'done')
      target.setAttribute('aria-live', 'polite')
      document.getElementById('result').textContent = [target.className, target.dataset.state, target.getAttribute('aria-live')].join('|')
    </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const target = preview.locator('#target')
  await expect(target).toHaveText('content')
  await expect(preview.locator('#result')).toHaveText('after ready|done|polite')
}
