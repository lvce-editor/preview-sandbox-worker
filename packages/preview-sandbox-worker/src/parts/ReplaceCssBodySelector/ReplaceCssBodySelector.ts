const BODY_SELECTOR_REGEX = /\bbody\b/g
const HTML_SELECTOR_REGEX = /\bhtml\b/g

/**
 * Wraps CSS in a CSS nesting block (.Preview { ... }) and replaces 'html' and 'body'
 * selectors with '&' (the parent selector in CSS nesting).
 * This approach uses CSS nesting to automatically scope all selectors to the preview div.
 * Other selectors like 'button' or '*' are automatically scoped within the nesting.
 *
 * @param css The CSS string to process
 * @returns The CSS string wrapped in .Preview nesting block with proper selector replacements
 */
export const replaceCssBodySelector = (css: string): string => {
  if (!css.trim()) {
    return css
  }

  // Replace 'html' selector with '&' (CSS nesting parent selector)
  let result = css.replaceAll(HTML_SELECTOR_REGEX, '&')

  // Replace 'body' selector with '&' (CSS nesting parent selector)
  result = result.replaceAll(BODY_SELECTOR_REGEX, '&')

  // Wrap the entire CSS in .Preview nesting block
  result = `.Preview {\n${result}\n}`

  return result
}
