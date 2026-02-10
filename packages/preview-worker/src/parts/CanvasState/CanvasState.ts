/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
interface CanvasInstance {
  readonly dataId: string
  readonly element: any
  readonly offscreenCanvas: OffscreenCanvas
}

interface CanvasStateEntry {
  readonly animationFrameHandles: number[]
  readonly instances: CanvasInstance[]
}

const states: Map<number, CanvasStateEntry> = new Map()

export const get = (uid: number): CanvasStateEntry | undefined => {
  return states.get(uid)
}

export const set = (uid: number, entry: CanvasStateEntry): void => {
  states.set(uid, entry)
}

export const remove = (uid: number): void => {
  const entry = states.get(uid)
  if (entry) {
    for (const handle of entry.animationFrameHandles) {
      clearTimeout(handle)
    }
  }
  states.delete(uid)
}

export const clear = (): void => {
  for (const [, entry] of states) {
    for (const handle of entry.animationFrameHandles) {
      clearTimeout(handle)
    }
  }
  states.clear()
}

export const addAnimationFrameHandle = (uid: number, handle: number): void => {
  const entry = states.get(uid)
  if (entry) {
    entry.animationFrameHandles.push(handle)
  }
}

export const removeAnimationFrameHandle = (uid: number, handle: number): void => {
  const entry = states.get(uid)
  if (entry) {
    const index = entry.animationFrameHandles.indexOf(handle)
    if (index !== -1) {
      entry.animationFrameHandles.splice(index, 1)
    }
  }
}
