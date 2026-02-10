import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-resize'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas-resize.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Canvas Resize Test</title>
  <style>
    canvas {
      border: 1px solid #ccc;
      display: block;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <h2>Canvas Resize Test</h2>
  <p>Initial size: 200x200</p>
  <canvas id="resizableCanvas" width="200" height="200"></canvas>
  <button id="resizeBtn">Resize Canvas</button>
  <span id="canvasSize"></span>

  <script>
    const canvas = document.getElementById('resizableCanvas');
    const ctx = canvas.getContext('2d');
    const sizeSpan = document.getElementById('canvasSize');

    function drawAndUpdateSize() {
      // Draw a filled rectangle to verify size
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update size display
      sizeSpan.textContent = canvas.width + 'x' + canvas.height;
    }

    // Initial draw
    drawAndUpdateSize();

    // Resize on button click
    document.getElementById('resizeBtn').addEventListener('click', () => {
      canvas.width = 400;
      canvas.height = 300;
      drawAndUpdateSize();
    });

  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const heading = previewArea.locator('h2')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Canvas Resize Test')
  const canvas = previewArea.locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '200')
  await expect(canvas).toHaveAttribute('height', '200')
  const sizeSpan = previewArea.locator('#canvasSize')
  await expect(sizeSpan).toContainText('200x200')

  // act
  await Command.execute('Preview.handleClick', '2')

  // assert
  await expect(canvas).toHaveAttribute('width', '400')
  await expect(canvas).toHaveAttribute('height', '300')
  await expect(sizeSpan).toContainText('400x300')
}
