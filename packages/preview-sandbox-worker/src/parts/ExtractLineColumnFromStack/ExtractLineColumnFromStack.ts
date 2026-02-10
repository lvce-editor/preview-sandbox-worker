/**
 * Extracts line and column information from an error stack trace
 * Looks for patterns like "<anonymous>:114:26" in the stack trace
 */
export const extractLineColumnFromStack = (stack: string): { line: number; column: number } | null => {
  // Match patterns like "<anonymous>:114:26" or eval:114:26
  const match = stack.match(/<anonymous>:(\d+):(\d+)/)
  if (match) {
    return {
      column: Number.parseInt(match[2], 10),
      line: Number.parseInt(match[1], 10),
    }
  }
  return null
}
