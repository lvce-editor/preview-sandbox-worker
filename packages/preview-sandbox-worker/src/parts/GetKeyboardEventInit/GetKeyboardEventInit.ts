const numericCodeMap: Record<number, string> = {
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  27: 'Escape',
  32: 'Space',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
}

const getNumericCode = (code: string | number): number | undefined => {
  if (typeof code === 'number' && Number.isFinite(code)) {
    return code
  }
  if (typeof code === 'string' && /^\d+$/.test(code)) {
    return Number(code)
  }
  return undefined
}

const getCodeFromNumericCode = (numericCode: number): string => {
  if (numericCodeMap[numericCode]) {
    return numericCodeMap[numericCode]
  }
  if (numericCode >= 48 && numericCode <= 57) {
    return `Digit${String.fromCharCode(numericCode)}`
  }
  if (numericCode >= 65 && numericCode <= 90) {
    return `Key${String.fromCharCode(numericCode)}`
  }
  return String(numericCode)
}

const getCodeFromKey = (key: string): string => {
  if (key === ' ' || key === 'Space' || key === 'Spacebar') {
    return 'Space'
  }
  if (key === 'Enter' || key.startsWith('Arrow')) {
    return key
  }
  if (/^[a-z]$/i.test(key)) {
    return `Key${key.toUpperCase()}`
  }
  if (/^[0-9]$/.test(key)) {
    return `Digit${key}`
  }
  return key
}

const getNormalizedCode = (key: string, code: string | number): string => {
  const numericCode = getNumericCode(code)
  if (numericCode !== undefined) {
    return getCodeFromNumericCode(numericCode)
  }
  if (typeof code === 'string' && code) {
    return code
  }
  return getCodeFromKey(key)
}

const getNormalizedKey = (key: string, normalizedCode: string): string => {
  if (key === 'Space' || key === 'Spacebar') {
    return ' '
  }
  if (key) {
    return key
  }
  if (normalizedCode === 'Space') {
    return ' '
  }
  if (/^Key[A-Z]$/.test(normalizedCode)) {
    return normalizedCode.slice(3).toLowerCase()
  }
  if (/^Digit[0-9]$/.test(normalizedCode)) {
    return normalizedCode.slice(5)
  }
  return normalizedCode
}

const getLegacyKeyCode = (normalizedCode: string, code: string | number): number => {
  const numericCode = getNumericCode(code)
  if (numericCode !== undefined) {
    return numericCode
  }
  for (const [key, value] of Object.entries(numericCodeMap)) {
    if (value === normalizedCode) {
      return Number(key)
    }
  }
  if (/^Key[A-Z]$/.test(normalizedCode)) {
    return normalizedCode.charCodeAt(3)
  }
  if (/^Digit[0-9]$/.test(normalizedCode)) {
    return normalizedCode.charCodeAt(5)
  }
  return 0
}

export const getKeyboardEventInit = (key: string, code: string | number): any => {
  const normalizedCode = getNormalizedCode(key, code)
  const normalizedKey = getNormalizedKey(key, normalizedCode)
  const keyCode = getLegacyKeyCode(normalizedCode, code)
  return {
    code: normalizedCode,
    key: normalizedKey,
    keyCode,
  }
}