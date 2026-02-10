import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const renderIncremental = (oldState: PreviewState, newState: PreviewState): any => {
  const oldDom = renderItems(oldState, oldState)[2]
  const newDom = renderItems(newState, newState)[2]
  const patches = diffTree(oldDom, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
