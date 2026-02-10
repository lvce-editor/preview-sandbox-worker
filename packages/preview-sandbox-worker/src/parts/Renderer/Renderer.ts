import type { PreviewState } from '../PreviewState/PreviewState.ts'

export interface Renderer {
  (oldState: PreviewState, newState: PreviewState): readonly any[]
}
