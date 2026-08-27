import * as HappyDomState from '../HappyDomState/HappyDomState.ts'

export interface Dimensions {
  readonly height: number
  readonly width: number
}

export const resize = (uid: number, dimensions: Dimensions): void => {
  const happyDomInstance = HappyDomState.get(uid)
  if (!happyDomInstance) {
    return
  }

  const { window } = happyDomInstance
  window.innerHeight = dimensions.height
  window.innerWidth = dimensions.width
  const globalScope = globalThis as typeof globalThis & { innerHeight: number; innerWidth: number }
  globalScope.innerHeight = dimensions.height
  globalScope.innerWidth = dimensions.width
  window.dispatchEvent(new window.Event('resize'))
}
