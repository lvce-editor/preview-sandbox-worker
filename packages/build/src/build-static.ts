import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/preview-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/previewWorkerMain.js')
const remoteUrl = getRemoteUrl(workerPath)

const occurrence = `// const previewWorkerUrl = \`\${assetDir}/packages/preview-worker/dist/previewWorkerMain.js\`
const previewWorkerUrl = \`${remoteUrl}\``
const replacement = `const previewWorkerUrl = \`\${assetDir}/packages/preview-worker/dist/previewWorkerMain.js\``
if (!content.includes(occurrence)) {
  throw new Error('occurrence not found')
}
const newContent = content.replace(occurrence, replacement)
await writeFile(rendererWorkerPath, newContent)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
