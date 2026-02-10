import * as Diff from '../Diff/Diff.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { newState, oldState } = PreviewStates.get(uid)
  const result = Diff.diff(oldState, newState)
  return result
}
