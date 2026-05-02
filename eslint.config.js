import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  {
    files: ['packages/preview-sandbox-worker/src/parts/DispatchEvent/DispatchEvent.ts'],
    rules: {
      'sonarjs/code-eval': 'off',
    },
  },
  {
    files: ['packages/preview-sandbox-worker/src/parts/ExecuteScripts/ExecuteScripts.ts'],
    rules: {
      'sonarjs/code-eval': 'off',
    },
  },
  {
    files: [
      'packages/preview-sandbox-worker/src/parts/GetTopLevelFunctionNames/GetTopLevelFunctionNames.ts',
      'packages/preview-sandbox-worker/src/parts/ParseHtml/ParseHtml.ts',
      'packages/preview-sandbox-worker/src/parts/SerializeHappyDom/SerializeHappyDom.ts',
      'packages/preview-sandbox-worker/src/parts/TokenizeHtml/TokenizeHtml.ts',
    ],
    rules: {
      'sonarjs/cognitive-complexity': 'off',
    },
  },
  {
    files: ['packages/preview-sandbox-worker/src/parts/TokenizeHtml/TokenizeHtml.ts'],
    rules: {
      'sonarjs/no-duplicated-branches': 'off',
      'sonarjs/no-nested-assignment': 'off',
    },
  },
  {
    files: ['packages/preview-sandbox-worker/src/parts/HtmlTokenType/HtmlTokenType.ts'],
    rules: {
      'sonarjs/redundant-type-aliases': 'off',
    },
  },
  {
    files: ['packages/preview-sandbox-worker/test/PatchCanvasElements.test.ts'],
    rules: {
      'jest/no-disabled-tests': 'off',
    },
  },
]
