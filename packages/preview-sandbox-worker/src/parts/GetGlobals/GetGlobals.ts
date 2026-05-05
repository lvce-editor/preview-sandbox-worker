import * as Alert from '../Alert/Alert.ts'
import { createLocalStorage } from '../LocalStorage/LocalStorage.ts'

export interface Globals {
  globalGlobals: {
    alert: typeof Alert.alert
    devicePixelRatio: number
    innerHeight: number
    innerWidth: number
    localStorage: ReturnType<typeof createLocalStorage>
  }
  windowGlobals: {
    alert: typeof Alert.alert
    devicePixelRatio: number
    innerHeight: number
    innerWidth: number
  }
}

export const getGlobals = (width: number, height: number, devicePixelRatio: number = 1): Globals => {
  const localStorage = createLocalStorage()
  return {
    globalGlobals: {
      alert: Alert.alert,
      devicePixelRatio,
      innerHeight: height,
      innerWidth: width,
      localStorage,
    },
    windowGlobals: {
      alert: Alert.alert,
      devicePixelRatio,
      innerHeight: height,
      innerWidth: width,
    },
  }
}
