import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcessPath = join(root, 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/preview-sandbox-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

// Ship the candidate at the configured runtime URL, including on static sites.
await cp(join(root, '.tmp', 'dist', 'dist'), join(root, 'dist', commitHash, 'packages', 'preview-sandbox-worker', 'dist'), {
  recursive: true,
})

await cp(
  new URL('./', import.meta.resolve('@lvce-editor/renderer-process')),
  join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist'),
  { recursive: true },
)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
