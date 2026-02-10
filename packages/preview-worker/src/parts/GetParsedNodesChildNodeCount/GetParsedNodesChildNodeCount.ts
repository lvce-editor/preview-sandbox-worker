import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Assert from '../Assert/Assert.ts'

export const getParsedNodesChildNodeCount = (parsedDom: readonly VirtualDomNode[]): number => {
  Assert.array(parsedDom)

  const rootCountFromParse = (parsedDom as any).rootChildCount
  if (typeof rootCountFromParse === 'number') {
    return rootCountFromParse
  }

  let rootChildCount = 0
  let i = 0

  while (i < parsedDom.length) {
    rootChildCount++

    // skip the entire subtree of the current node
    let toSkip = parsedDom[i].childCount
    i++
    while (toSkip > 0 && i < parsedDom.length) {
      toSkip -= 1
      toSkip += parsedDom[i].childCount
      i++
    }
  }

  return rootChildCount
}
