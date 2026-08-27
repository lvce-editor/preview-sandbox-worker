/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-form-constraints'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-form-constraints.html`
  const html = `<!doctype html><html><body><input id="quantity" type="number" min="-5" max="10" step="0.5" value="0"><textarea id="note" minlength="2" maxlength="20" rows="3" cols="12"></textarea><p id="result">pending</p><script>
    const note = document.getElementById('note')
    document.getElementById('result').textContent = [note.minLength, note.maxLength, note.rows, note.cols].join(',')
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const input = preview.locator('#quantity')
  await expect(input).toHaveAttribute('type', 'number')
  await expect(input).toHaveAttribute('min', '-5')
  await expect(input).toHaveAttribute('max', '10')
  await expect(input).toHaveAttribute('step', '0.5')
  await expect(preview.locator('#note')).toHaveCount(1)
  await expect(preview.locator('#result')).toHaveText('2,20,3,12')
}
