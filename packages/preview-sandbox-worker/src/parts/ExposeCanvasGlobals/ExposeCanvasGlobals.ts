/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Document, Window } from 'happy-dom-without-node'

export const exposeCanvasGlobals = (window: Window, document: Document): void => {
  const existingCanvasRenderingContext2D =
    (globalThis as any).OffscreenCanvasRenderingContext2D ||
    Object.getOwnPropertyDescriptor(window, 'CanvasRenderingContext2D')?.value ||
    Object.getOwnPropertyDescriptor(globalThis, 'CanvasRenderingContext2D')?.value
  if (existingCanvasRenderingContext2D) {
    ;(window as any).CanvasRenderingContext2D = existingCanvasRenderingContext2D
    ;(globalThis as any).CanvasRenderingContext2D = existingCanvasRenderingContext2D
    return
  }

  // Select a context only when a script actually uses the 2D constructor.
  // Eagerly asking for '2d' prevents the same canvas from using WebGL.
  const getConstructor = (): unknown => {
    const canvas = document.querySelector('canvas') as any
    return canvas?.getContext?.('2d')?.constructor
  }
  for (const target of [window, globalThis]) {
    Object.defineProperty(target, 'CanvasRenderingContext2D', {
      configurable: true,
      get: getConstructor,
      set: (value: unknown): void => {
        Object.defineProperty(target, 'CanvasRenderingContext2D', { configurable: true, value, writable: true })
      },
    })
  }
}
