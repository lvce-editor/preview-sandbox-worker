import type { Document } from 'happy-dom-without-node'
import { Window } from 'happy-dom-without-node'

export interface CreateWindowResult {
  readonly document: Document
  readonly window: Window
}

export const createWindow = (rawHtml: string, url: string = 'http://localhost:3000'): CreateWindowResult => {
  const window = new Window({ url })
  const { document } = window
  document.documentElement.innerHTML = rawHtml
  return { document, window }
}
