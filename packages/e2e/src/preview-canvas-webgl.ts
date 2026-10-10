import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.canvas-webgl'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Preview, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-webgl.html`
  await FileSystem.writeFile(
    filePath,
    `<!DOCTYPE html><html><body>
<canvas id="scene" width="200" height="200"></canvas>
<button id="resize">Resize</button><span id="pixel"></span>
<script>
const canvas = document.getElementById('scene');
const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const pixel = new Uint8Array(4);
  gl.readPixels(10, 10, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  document.getElementById('pixel').textContent = pixel.join(',');
}
render();
document.getElementById('resize').addEventListener('click', () => {
  canvas.width = 400;
  canvas.height = 300;
  render();
});
</script></body></html>`,
  )
  await Command.execute('Layout.showPreview', filePath)
  const preview = Locator('.Viewlet.Preview')
  const canvas = preview.locator('#scene')
  const pixel = preview.locator('#pixel')
  await expect(canvas).toBeVisible()
  await expect(pixel).toHaveText('0,0,255,255')
  const resizeButton = preview.locator('#resize')
  await expect(resizeButton).toHaveAttribute('data-id', '0')
  await Preview.handleClick('0')
  await expect(canvas).toHaveAttribute('width', '400')
  await expect(canvas).toHaveAttribute('height', '300')
  await expect(pixel).toHaveText('0,0,255,255')
}
