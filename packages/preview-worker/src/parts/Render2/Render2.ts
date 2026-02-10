import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as SourceControlStates from '../PreviewStates/PreviewStates.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] => {
  const { newState, oldState } = SourceControlStates.get(uid)
  SourceControlStates.set(uid, newState, newState)
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  return commands
}
