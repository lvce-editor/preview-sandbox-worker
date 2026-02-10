// const FUNCTION_REGEX = /(?:^|[\n;])\s*function\s+([a-zA-Z_$][\w$]*)/g

export const getTopLevelFunctionNames = (script: string): readonly string[] => {
  const names: string[] = []
  let braceDepth = 0
  let i = 0

  while (i < script.length) {
    const char = script[i]

    // Skip strings
    if (char === '"' || char === "'" || char === '`') {
      const quote = char
      i++
      while (i < script.length) {
        if (script[i] === '\\') {
          i += 2
          continue
        }
        if (script[i] === quote) {
          i++
          break
        }
        i++
      }
      continue
    }

    // Skip comments
    if (char === '/' && script[i + 1] === '/') {
      // Line comment
      i += 2
      while (i < script.length && script[i] !== '\n') {
        i++
      }
      continue
    }

    if (char === '/' && script[i + 1] === '*') {
      // Block comment
      i += 2
      while (i < script.length - 1) {
        if (script[i] === '*' && script[i + 1] === '/') {
          i += 2
          break
        }
        i++
      }
      continue
    }

    // Track braces
    if (char === '{') {
      braceDepth++
      i++
      continue
    }

    if (char === '}') {
      braceDepth--
      i++
      continue
    }

    // Only look for functions at depth 0
    if (braceDepth === 0 && char === 'f' && script.slice(i, i + 8) === 'function') {
      // Check if 'function' is a complete word
      const charBefore = i > 0 ? script[i - 1] : ' '
      const charAfter = script[i + 8] ?? ' '

      const isValidBefore = /\s|^|;|{|}/.test(charBefore)
      const isValidAfter = /\s/.test(charAfter)

      if (isValidBefore && isValidAfter) {
        i += 8
        // Skip whitespace
        while (i < script.length && /\s/.test(script[i])) {
          i++
        }
        // Extract function name
        const nameMatch = script.slice(i).match(/^([a-zA-Z_$][\w$]*)/)
        if (nameMatch) {
          names.push(nameMatch[1])
        }
        continue
      }
    }

    i++
  }

  return names
}
