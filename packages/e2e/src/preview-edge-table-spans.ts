/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.edge-table-spans'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-edge-table-spans.html`
  const html = `<!doctype html><html><body><table id="matrix"><thead><tr><th id="heading" colspan="2" scope="colgroup">Heading</th></tr></thead><tbody><tr><td id="side" rowspan="2">Side</td><td>A</td></tr><tr><td>B</td></tr></tbody></table><p id="result">pending</p><script>
    const heading = document.getElementById('heading')
    const side = document.getElementById('side')
    document.getElementById('result').textContent = [heading.getAttribute('colspan'), heading.getAttribute('scope'), side.getAttribute('rowspan')].join('|')
  </script></body></html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  await expect(preview).toBeVisible()
  const rows = preview.locator('#matrix tbody tr')
  await expect(rows).toHaveCount(2)
  const cells = preview.locator('#matrix td')
  await expect(cells).toHaveCount(3)
  const result = preview.locator('#result')
  await expect(result).toHaveText('2|colgroup|2')
}
