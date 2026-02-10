import * as Alert from '../Alert/Alert.ts'
import { createLocalStorage } from '../LocalStorage/LocalStorage.ts'

export interface Globals {
  globalGlobals: {
    alert: typeof Alert.alert
    innerHeight: number
    innerWidth: number
    localStorage: ReturnType<typeof createLocalStorage>
  }
  windowGlobals: {
    alert: typeof Alert.alert
    innerHeight: number
    innerWidth: number
  }
}

export const getGlobals = (width: number, height: number): Globals => {
  const localStorage = createLocalStorage()
  return {
    globalGlobals: {
      alert: Alert.alert,
      innerHeight: height,
      innerWidth: width,
      localStorage,
    },
    windowGlobals: {
      alert: Alert.alert,
      innerHeight: height,
      innerWidth: width,
    },
  }
}
