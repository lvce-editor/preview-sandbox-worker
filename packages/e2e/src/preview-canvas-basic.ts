import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-basic'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // Create a temporary HTML file with canvas element
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-canvas.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Canvas Basic Test</title>
  <style>
    canvas {
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <h2>Canvas Drawing Test</h2>
  <canvas id="myCanvas" width="200" height="200"></canvas>
  <span id="pixelBlue"></span>
  <span id="pixelRed"></span>
  <span id="pixelBackground"></span>

  <script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Draw a simple rectangle
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 100, 100);

    // Draw a circle
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(150, 150, 30, 0, Math.PI * 2);
    ctx.fill();

    // Read pixel data at known locations and write to DOM
    // Blue rectangle center at (75, 75)
    const bluePixel = ctx.getImageData(75, 75, 1, 1).data;
    document.getElementById('pixelBlue').textContent = bluePixel.join(',');

    // Red circle center at (150, 150)
    const redPixel = ctx.getImageData(150, 150, 1, 1).data;
    document.getElementById('pixelRed').textContent = redPixel.join(',');

    // Background pixel at (10, 10) - should be transparent
    const bgPixel = ctx.getImageData(10, 10, 1, 1).data;
    document.getElementById('pixelBackground').textContent = bgPixel.join(',');
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)

  // Open the preview with the HTML file
  await Command.execute('Layout.showPreview', filePath)

  // Wait for preview to render
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()

  // Verify the heading is visible
  const heading = previewArea.locator('h2')
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Canvas Drawing Test')

  // Verify the canvas element is present and visible
  const canvas = previewArea.locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(canvas).toHaveAttribute('width', '200')
  await expect(canvas).toHaveAttribute('height', '200')

  // Verify actual drawn content via pixel data
  // Blue rectangle center (75, 75) should be blue: RGBA(0, 0, 255, 255)
  const pixelBlue = previewArea.locator('#pixelBlue')
  await expect(pixelBlue).toHaveText('0,0,255,255')

  // Red circle center (150, 150) should be red: RGBA(255, 0, 0, 255)
  const pixelRed = previewArea.locator('#pixelRed')
  await expect(pixelRed).toHaveText('255,0,0,255')

  // Background (10, 10) should be transparent: RGBA(0, 0, 0, 0)
  const pixelBackground = previewArea.locator('#pixelBackground')
  await expect(pixelBackground).toHaveText('0,0,0,0')
}
