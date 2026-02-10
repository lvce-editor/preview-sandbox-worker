import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEmptyPreviewDom } from '../GetEmptyPreviewDom/GetEmptyPreviewDom.ts'

export const getPreviewDom = (state: PreviewState): readonly any[] => {
  const { parsedDom, parsedNodesChildNodeCount, uri } = state

  if (!uri) {
    return getEmptyPreviewDom()
  }

  // If parsedDom is available, render it as children of the wrapper
  if (parsedDom && parsedDom.length > 0) {
    return [
      {
        childCount: parsedNodesChildNodeCount,
        className: 'Viewlet Preview',
        onClick: DomEventListenerFunctions.HandleClick,
        onInput: DomEventListenerFunctions.HandleInput,
        onKeyDown: DomEventListenerFunctions.HandleKeydown,
        onKeyUp: DomEventListenerFunctions.HandleKeyup,
        onMouseDown: DomEventListenerFunctions.HandleMousedown,
        onMouseMove: DomEventListenerFunctions.HandleMousemove,
        onMouseUp: DomEventListenerFunctions.HandleMouseup,
        tabIndex: 0,
        type: VirtualDomElements.Div,
      },
      ...parsedDom,
    ]
  }

  return [
    {
      childCount: 1,
      className: 'Viewlet Preview',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeydown,
      onKeyUp: DomEventListenerFunctions.HandleKeyup,
      onMouseDown: DomEventListenerFunctions.HandleMousedown,
      onMouseMove: DomEventListenerFunctions.HandleMousemove,
      onMouseUp: DomEventListenerFunctions.HandleMouseup,
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    {
      text: 'Edit the file on the left to get started.',
      type: VirtualDomElements.Text,
    },
  ]
}
