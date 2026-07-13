import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  {
    files: ['**/*.ts'],
    rules: {
      'sonarjs/no-trivial-assertions': 'off',
      'sonarjs/prefer-specific-assertions': 'off',
      'unicorn/better-dom-traversing': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/no-duplicate-if-branches': 'off',
      'unicorn/no-error-property-assignment': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/no-useless-coercion': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      'unicorn/prefer-iterator-to-array': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-number-is-safe-integer': 'off',
      'unicorn/prefer-object-define-properties': 'off',
      'unicorn/prefer-scoped-selector': 'off',
    },
  },
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
