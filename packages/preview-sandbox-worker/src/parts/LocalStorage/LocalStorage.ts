interface Storage {
  clear(): void
  getItem(key: string): string | null
  key(index: number): string | null
  readonly length: number
  removeItem(key: string): void
  setItem(key: string, value: string): void
}

export const createLocalStorage = (): Storage => {
  const store: Map<string, string> = new Map()

  const getItem = (key: string): string | null => {
    if (store.has(key)) {
      return store.get(key) as string
    }
    return null
  }

  const setItem = (key: string, value: string): void => {
    store.set(key, String(value))
  }

  const removeItem = (key: string): void => {
    store.delete(key)
  }

  const clear = (): void => {
    store.clear()
  }

  const key = (index: number): string | null => {
    const keys = [...store.keys()]
    if (index < 0 || index >= keys.length) {
      return null
    }
    return keys[index]
  }

  const localStorage: Storage = {
    clear,
    getItem,
    key,
    get length(): number {
      return store.size
    },
    removeItem,
    setItem,
  }

  return localStorage
}
