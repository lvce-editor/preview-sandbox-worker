import { chromium, expect } from '@playwright/test'
import getPort from 'get-port'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { serverPath } from '@lvce-editor/server'

const port = await getPort()
const server = fork(serverPath, {
  env: { ...process.env, ONLY_EXTENSION: '.', PORT: String(port), TEST_PATH: '.' },
  stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
})
let browser
try {
  await Promise.race([
    once(server, 'message', { signal: AbortSignal.timeout(30_000) }),
    once(server, 'exit').then(() => {
      throw new Error('Test server exited before becoming ready')
    }),
  ])
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}/tests/preview-input-event.html`)
  await expect(page.locator('#TestOverlay')).toHaveAttribute('data-state', 'pass')
  const input = page.locator('.Viewlet.Preview #textInput')
  const output = page.locator('.Viewlet.Preview #output')
  const registered = page.locator('.Viewlet.Preview #registered')
  const body = page.locator('.Viewlet.Preview .Body')

  for (const [color, inputCount, changeCount, background] of [
    ['green', 6, 2, 'rgb(0, 128, 0)'],
    ['blue', 10, 3, 'rgb(0, 0, 255)'],
  ]) {
    await input.selectText()
    await input.pressSequentially(color)
    await expect(input).toBeFocused()
    // Typing must not commit a change before the input loses focus.
    await expect(output).toHaveText(changeCount === 2 ? 'red:1:1' : 'green:6:2')
    await page.keyboard.press('Tab')
    await expect(input).not.toBeFocused()
    await expect(output).toHaveText(`${color}:${inputCount}:${changeCount}`)
    await expect(registered).toHaveText(String(changeCount))
    await expect(body).toHaveCSS('background-color', background)
  }
  console.info('PASS native input/change: two edits, real typing and blur, exactly-once handlers and body background')
} finally {
  await browser?.close()
  if (server.exitCode === null && server.signalCode === null) {
    const exited = once(server, 'exit')
    server.kill()
    await exited
  }
}
