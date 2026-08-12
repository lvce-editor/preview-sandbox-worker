/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'

export interface RuntimeDiagnostic {
  readonly codeFrame?: string
  readonly level: 'debug' | 'error' | 'info' | 'log' | 'warn'
  readonly message: string
  readonly stack?: string
  readonly type: 'console' | 'exception'
}

export interface RuntimeDiagnostics {
  readonly entries: readonly RuntimeDiagnostic[]
  readonly errorCount: number
}

const maxEntries = 100
const pendingConsoleErrors: Map<number, Error> = new Map()
const states: Map<number, RuntimeDiagnostic[]> = new Map()
const workerConsole: Console = globalThis.console

const getEntries = (uid: number): RuntimeDiagnostic[] => {
  let entries = states.get(uid)
  if (!entries) {
    entries = []
    states.set(uid, entries)
  }
  return entries
}

const add = (uid: number, entry: RuntimeDiagnostic): void => {
  const entries = getEntries(uid)
  entries.push(entry)
  if (entries.length > maxEntries) {
    entries.splice(0, entries.length - maxEntries)
  }
}

const stringifyObject = (value: object): string => {
  const seen = new WeakSet<object>()
  try {
    return (
      JSON.stringify(value, (_key, item: unknown) => {
        if (typeof item === 'bigint') {
          return `${item}n`
        }
        if (item && typeof item === 'object') {
          if (seen.has(item)) {
            return '[Circular]'
          }
          seen.add(item)
        }
        return item
      }) || '[Unserializable object]'
    )
  } catch {
    return '[Unserializable object]'
  }
}

const stringifyArgument = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }
  if (value instanceof Error) {
    return value.stack || value.message
  }
  if (value && typeof value === 'object') {
    return stringifyObject(value)
  }
  return String(value)
}

const getMessage = (values: readonly unknown[]): string => {
  return values.map(stringifyArgument).join(' ')
}

const consoleLevels = ['debug', 'error', 'info', 'log', 'warn'] as const

const createConsole = (uid: number): Console => {
  const runtimeConsole = Object.create(console) as Console
  for (const level of consoleLevels) {
    runtimeConsole[level] = (...values: readonly unknown[]): void => {
      add(uid, {
        level,
        message: getMessage(values),
        type: 'console',
      })
      if (level === 'error' && values.length === 1 && values[0] instanceof Error) {
        pendingConsoleErrors.set(uid, values[0])
      }
      workerConsole[level](...values)
    }
  }
  return runtimeConsole
}

export const addException = (uid: number, error: unknown, codeFrame: string = ''): void => {
  const actualError = error instanceof Error ? error : new Error(String(error))
  const entries = getEntries(uid)
  const lastEntry = entries.at(-1)
  if (lastEntry?.type === 'console' && pendingConsoleErrors.get(uid) === actualError) {
    entries.pop()
  }
  pendingConsoleErrors.delete(uid)
  add(uid, {
    ...(codeFrame && { codeFrame }),
    level: 'error',
    message: actualError.message,
    ...(actualError.stack && { stack: actualError.stack }),
    type: 'exception',
  })
}

export const clear = (uid: number): void => {
  pendingConsoleErrors.delete(uid)
  states.delete(uid)
}

export const clearAll = (): void => {
  pendingConsoleErrors.clear()
  states.clear()
}

export const getRuntimeDiagnostics = (uid: number): RuntimeDiagnostics => {
  const entries = states.get(uid) || []
  return {
    entries: [...entries],
    errorCount: entries.filter((entry) => entry.level === 'error').length,
  }
}

export const install = (uid: number, window: Window): Console => {
  const runtimeConsole = createConsole(uid)
  window.console = runtimeConsole
  window.addEventListener('error', (event) => {
    const errorEvent = event as unknown as ErrorEvent
    addException(uid, errorEvent.error || errorEvent.message)
  })
  window.addEventListener('unhandledrejection', (event) => {
    const rejectionEvent = event as unknown as PromiseRejectionEvent
    addException(uid, rejectionEvent.reason)
  })
  return runtimeConsole
}
