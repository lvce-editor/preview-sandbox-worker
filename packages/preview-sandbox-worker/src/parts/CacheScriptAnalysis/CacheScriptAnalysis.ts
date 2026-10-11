// Retain analysis results, never the much larger parser ASTs. The fixed library
// stays hot while edits replace the other entry, without unbounded source retention.
export const cacheScriptAnalysis = <T>(analyze: (script: string) => T, maxBytes: number = 2 * 1024 * 1024): ((script: string) => T) => {
  const entries = new Map<string, T>()
  let bytes = 0
  return (script): T => {
    if (entries.has(script)) {
      const result = entries.get(script) as T
      entries.delete(script)
      entries.set(script, result)
      return result
    }
    const result = analyze(script)
    const size = script.length * 2
    if (size > maxBytes) return result
    entries.set(script, result)
    bytes += size
    while (entries.size > 2 || bytes > maxBytes) {
      const oldest = entries.keys().next().value
      if (oldest === undefined) break
      entries.delete(oldest)
      bytes -= oldest.length * 2
    }
    return result
  }
}
