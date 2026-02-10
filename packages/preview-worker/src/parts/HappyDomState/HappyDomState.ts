/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
interface HappyDomInstance {
  readonly document: any
  readonly elementMap: Map<string, any>
  readonly window: any
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
