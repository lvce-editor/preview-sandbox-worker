import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const iEqual = (oldState: PreviewState, newState: PreviewState): boolean => {
  if (oldState.css.length !== newState.css.length) {
    return false
  }

  for (let i = 0; i < oldState.css.length; i++) {
    if (oldState.css[i] !== newState.css[i]) {
      return false
    }
  }

  return true
}
