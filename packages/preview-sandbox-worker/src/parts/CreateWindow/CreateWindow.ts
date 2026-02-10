import type { Document } from 'happy-dom-without-node'
import { Window } from 'happy-dom-without-node'

export interface CreateWindowResult {
  readonly document: Document
  readonly window: Window
}

export const createWindow = (rawHtml: string): CreateWindowResult => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window

  // Parse the raw HTML into the happy-dom document
  document.documentElement.innerHTML = rawHtml

  return { document, window }
}
