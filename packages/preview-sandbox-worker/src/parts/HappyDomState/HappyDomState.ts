import type { Document, Window } from 'happy-dom-without-node'

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
interface HappyDomInstance {
  readonly document: Document
  readonly elementMap: Record<string, any>
  readonly window: Window
}

const states: Map<number, HappyDomInstance> = new Map()

export const get = (uid: number): HappyDomInstance | undefined => {
  return states.get(uid)
}

export const set = (uid: number, instance: HappyDomInstance): void => {
  states.set(uid, instance)
}

export const remove = (uid: number): void => {
  states.delete(uid)
}

export const clear = (): void => {
  states.clear()
}
