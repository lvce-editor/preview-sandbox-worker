import { describe, expect, test } from '@jest/globals'
import * as ReplaceCssBodySelector from '../src/parts/ReplaceCssBodySelector/ReplaceCssBodySelector.ts'

describe('ReplaceCssBodySelector', () => {
  test('should replace simple body selector with CSS nesting', () => {
    const css = 'body { color: red; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n& { color: red; }\n}')
  })

  test('should replace body in combined selectors', () => {
    const css = 'body, div { margin: 0; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n&, div { margin: 0; }\n}')
  })

  test('should replace multiple body selectors', () => {
    const css = 'body { color: red; } body p { margin: 10px; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n& { color: red; } & p { margin: 10px; }\n}')
  })

  test('should not replace tbody', () => {
    const css = 'tbody { border: 1px solid; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\ntbody { border: 1px solid; }\n}')
  })

  test('should not replace body as part of another word', () => {
    const css = 'somebody { color: blue; } anybody-class { display: none; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\nsomebody { color: blue; } anybody-class { display: none; }\n}')
  })

  test('should handle body with pseudo-classes', () => {
    const css = 'body:hover { background: yellow; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n&:hover { background: yellow; }\n}')
  })

  test('should handle body with pseudo-elements', () => {
    const css = 'body::before { content: ""; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n&::before { content: ""; }\n}')
  })

  test('should handle body with descendant selectors', () => {
    const css = 'body > * { box-sizing: border-box; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n& > * { box-sizing: border-box; }\n}')
  })

  test('should handle empty CSS string', () => {
    const css = ''
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('')
  })

  test('should handle CSS without body selector', () => {
    const css = 'div { color: green; } p { margin: 5px; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\ndiv { color: green; } p { margin: 5px; }\n}')
  })

  test('should handle body with newlines', () => {
    const css = `body {
  color: red;
  background: white;
}`
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe(`.Preview {
& {
  color: red;
  background: white;
}
}`)
  })

  test('should handle multiple body selectors in different contexts', () => {
    const css = 'body { font-size: 16px; } .container body { display: flex; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n& { font-size: 16px; } .container & { display: flex; }\n}')
  })

  test('should wrap universal selector in nesting', () => {
    const css = '* { box-sizing: border-box; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n* { box-sizing: border-box; }\n}')
  })

  test('should wrap multiple universal selectors in nesting', () => {
    const css = '* { margin: 0; } * { padding: 0; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n* { margin: 0; } * { padding: 0; }\n}')
  })

  test('should wrap universal selector with pseudo-classes in nesting', () => {
    const css = '*:hover { outline: 1px solid red; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n*:hover { outline: 1px solid red; }\n}')
  })

  test('should handle both body and universal selectors', () => {
    const css = 'body { color: black; } * { box-sizing: border-box; }'
    const result = ReplaceCssBodySelector.replaceCssBodySelector(css)
    expect(result).toBe('.Preview {\n& { color: black; } * { box-sizing: border-box; }\n}')
  })
})
