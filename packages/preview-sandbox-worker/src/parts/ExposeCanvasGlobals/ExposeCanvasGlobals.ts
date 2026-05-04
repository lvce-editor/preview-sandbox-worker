import type { Document, Window } from 'happy-dom-without-node'

export const exposeCanvasGlobals = (window: Window, document: Document): void => {
  const existingCanvasRenderingContext2D = (window as any).CanvasRenderingContext2D || (globalThis as any).CanvasRenderingContext2D
  if (existingCanvasRenderingContext2D) {
    ;(window as any).CanvasRenderingContext2D = existingCanvasRenderingContext2D
    ;(globalThis as any).CanvasRenderingContext2D = existingCanvasRenderingContext2D
    return
  }

  const canvas = document.querySelector('canvas') as any
  if (!canvas || typeof canvas.getContext !== 'function') {
    return
  }

  const context = canvas.getContext('2d')
  const CanvasRenderingContext2D = context?.constructor
  if (typeof CanvasRenderingContext2D !== 'function') {
    return
  }

  ;(window as any).CanvasRenderingContext2D = CanvasRenderingContext2D
  ;(globalThis as any).CanvasRenderingContext2D = CanvasRenderingContext2D
}
