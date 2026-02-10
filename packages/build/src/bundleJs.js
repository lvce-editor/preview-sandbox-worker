import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup } from 'rollup'
import { root } from './root.js'

const patchHappyDom = () => {
  return {
    name: 'patch-happy-dom',
    transform(code, id) {
      if (id.includes('whatwg-url') && code.includes('globalObject.eval')) {
        return code.replace(
          /try \{\s*ctorRegistry\["%AsyncIteratorPrototype%"\] = Object\.getPrototypeOf\(\s*Object\.getPrototypeOf\(\s*globalObject\.eval\("\(async function\* \(\) \{\}\)"\)\.prototype\s*\)\s*\);\s*\} catch \{\s*ctorRegistry\["%AsyncIteratorPrototype%"\] = AsyncIteratorPrototype;\s*\}/,
          'ctorRegistry["%AsyncIteratorPrototype%"] = AsyncIteratorPrototype;',
        )
      }
      return null
    },
  }
}

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: join(root, 'packages/preview-sandbox-worker/src/previewSandBoxWorkerMain.ts'),
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED' && warning.id && warning.id.includes('happy-dom-without-node')) {
      return
    }
    warn(warning)
  },
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: join(root, '.tmp/dist/dist/previewSandBoxWorkerMain.js'),
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  },
  external: ['ws', 'electron'],
  plugins: [
    patchHappyDom(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
    // @ts-ignore
    commonjs(),
    // @ts-ignore
    json(),
  ],
}

export const bundleJs = async () => {
  const input = await rollup(options)
  // @ts-ignore
  await input.write(options.output)
}
