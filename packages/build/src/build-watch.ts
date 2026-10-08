import { execa } from 'execa'
import { join } from 'node:path'
import { root } from './root.js'

const main = async () => {
  execa(
    'npm',
    [
      'exec',
      '--workspace',
      'build',
      '--',
      'esbuild',
      '--format=esm',
      '--bundle',
      '--external:node:buffer',
      '--external:electron',
      '--external:ws',
      '--external:node:worker_threads',
      '--watch',
      join(root, 'packages/preview-sandbox-worker/src/previewSandBoxWorkerMain.ts'),
      `--outfile=${join(root, '.tmp/dist/dist/previewSandBoxWorkerMain.js')}`,
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
}

main()
