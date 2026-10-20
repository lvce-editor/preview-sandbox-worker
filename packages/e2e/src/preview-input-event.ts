import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.input-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-input-change.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Input Event Test</title>
</head>
<body>
  <input type="text" id="textInput" placeholder="Type a color">
  <p id="output">No input received</p>
  <p id="registered">0</p>

  <script type="module">
    let inputEvents = 0
    let changeEvents = 0
    let registeredChanges = 0
    document.getElementById('textInput').addEventListener('input', function() {
      inputEvents++
    });
    document.getElementById('textInput').addEventListener('change', function() {
      registeredChanges++
      document.getElementById('registered').textContent = String(registeredChanges)
    });
    document.getElementById('textInput').onchange = function(event) {
      changeEvents++
      document.body.style.background = event.target.value
      document.getElementById('output').textContent = event.target.value + ':' + inputEvents + ':' + changeEvents
    };
  </script>
</body>
</html>`
  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const input = previewArea.locator('#textInput')
  const output = previewArea.locator('#output')
  const body = previewArea.locator('.Body')
  await expect(input).toBeVisible()
  await expect(output).toBeVisible()
  await expect(output).toHaveText('No input received')

  // The in-app locator API uses synthetic input. Native typing and blur are
  // covered separately by native-input-change.js.
  await input.type('red')
  await input.dispatchEvent('change', { bubbles: true } as unknown as string)

  await expect(output).toHaveText('red:1:1')
  await expect(body).toHaveCSS('background-color', 'rgb(255, 0, 0)')
}
