import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const getEmptyPreviewDom = (): readonly any[] => {
  return [
    {
      childCount: 1,
      className: 'Viewlet Preview',
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
}
