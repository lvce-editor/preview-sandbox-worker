import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetRenderer from '../GetRenderer/GetRenderer.ts'

export const applyRender = (oldState: PreviewState, newState: PreviewState, diffResult: readonly number[]): readonly any[] => {
  const commands = []
  for (const item of diffResult) {
    const fn = GetRenderer.getRenderer(item)
    const result = fn(oldState, newState)
    if (result.length > 0) {
      commands.push(result)
    }
  }
  return commands
}
