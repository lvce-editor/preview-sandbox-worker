import { ViewletCommand } from '@lvce-editor/constants'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { getPreviewDom } from '../GetPreviewDom/GetPreviewDom.ts'

export const renderItems = (oldState: PreviewState, newState: PreviewState): any => {
  const { initial, uid } = newState
  if (initial) {
    return [ViewletCommand.SetDom2, uid, []]
  }
  const dom = getPreviewDom(newState)
  return [ViewletCommand.SetDom2, uid, dom]
}
