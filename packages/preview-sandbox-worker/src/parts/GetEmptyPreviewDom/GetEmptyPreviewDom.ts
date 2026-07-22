import { mergeClassNames, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

const emptyPreviewDom: readonly VirtualDomNode[] = [
  {
    childCount: 1,
    className: mergeClassNames('Viewlet', 'Preview'),
    type: VirtualDomElements.Div,
  },
  {
    childCount: 1,
    type: VirtualDomElements.H1,
  },
  {
    text: 'No URI has been specified',
    type: VirtualDomElements.Text,
  },
]

export const getEmptyPreviewDom = (): readonly VirtualDomNode[] => {
  return emptyPreviewDom
}
