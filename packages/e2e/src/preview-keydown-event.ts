import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.keydown-event'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Preview, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-keydown.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Keydown Event Test</title>
</head>
<body>
  <p id="started">no</p>
  <p id="jumps">0</p>

  <script>
    let started = false;

    window.addEventListener('keydown', function(event) {
      if (!started) {
        started = true;
        document.getElementById('started').textContent = 'yes';
        return;
      }

      if (event.code === 'Space') {
        const jumps = Number(document.getElementById('jumps').textContent) + 1;
        document.getElementById('jumps').textContent = String(jumps);
      }
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const started = previewArea.locator('#started')
  const jumps = previewArea.locator('#jumps')
  await expect(started).toBeVisible()
  await expect(jumps).toBeVisible()
  await expect(started).toHaveText('no')
  await expect(jumps).toHaveText('0')

  // act
  // @ts-ignore
  await Preview.handleKeyDown('0', 'a', '65')
  await Preview.handleKeyDown('0', ' ', '32')

  // assert
  await expect(started).toHaveText('yes')
  await expect(jumps).toHaveText('1')
}
