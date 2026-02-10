import { extractLineColumnFromStack } from '../ExtractLineColumnFromStack/ExtractLineColumnFromStack.ts'

/**
 * Generates a code frame showing the error location with context
 * @param scriptContent The original script content
 * @param error The error object
 * @param contextLines Number of lines to show before/after the error (default: 2)
 * @returns Formatted code frame string or empty string if line info cannot be extracted
 */
export const getErrorCodeFrame = (scriptContent: string, error: any, contextLines: number = 2): string => {
  if (!error || !error.stack) {
    return ''
  }

  const lineColumn = extractLineColumnFromStack(error.stack)
  if (!lineColumn) {
    return ''
  }

  const { column, line } = lineColumn
  const lines = scriptContent.split('\n')

  // Line numbers in stack traces are 1-based
  // Offset by -4 to account for the anonymous function wrapper
  const errorLineIndex = line - 1 - 2

  if (errorLineIndex < 0 || errorLineIndex >= lines.length) {
    return ''
  }

  const startLine = Math.max(0, errorLineIndex - contextLines)
  const endLine = Math.min(lines.length - 1, errorLineIndex + contextLines)

  // Find the width of line numbers for padding
  const maxLineNum = endLine + 1
  const numberWidth = String(maxLineNum).length

  let codeFrame = '\n'

  // Add context lines before
  for (let i = startLine; i <= endLine; i++) {
    const lineNum = i + 1
    const isErrorLine = i === errorLineIndex
    const lineContent = lines[i]
    const lineNumStr = String(lineNum).padStart(numberWidth, ' ')
    const prefix = isErrorLine ? '> ' : '  '

    codeFrame += `${prefix}${lineNumStr} | ${lineContent}\n`

    // Add a caret pointing to the error column on the error line
    if (isErrorLine && column > 0) {
      const caretPosition = column - 1
      // @ts-ignore
      const spacing = ' '.repeat(numberWidth + 3 + caretPosition) // account for prefix "  " and " | "
      codeFrame += `   ${' '.repeat(numberWidth)} | ${' '.repeat(caretPosition)}^\n`
    }
  }

  return codeFrame
}
