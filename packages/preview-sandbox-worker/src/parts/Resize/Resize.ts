import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const resize = (state: PreviewState, dimensions: any): PreviewState => {
  return {
    ...state,
    ...dimensions,
  }
}
