/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'
import * as Alert from '../Alert/Alert.ts'
import { createLocalStorage } from '../LocalStorage/LocalStorage.ts'

export interface Globals {
  globalGlobals: {
    alert: typeof Alert.alert
    devicePixelRatio: number
    getComputedStyle: Window['getComputedStyle']
    innerHeight: number
    innerWidth: number
    localStorage: ReturnType<typeof createLocalStorage>
  }
  windowGlobals: {
    alert: typeof Alert.alert
    devicePixelRatio: number
    getComputedStyle: Window['getComputedStyle']
    innerHeight: number
    innerWidth: number
  }
}

export const getGlobals = (window: Window, width: number, height: number, devicePixelRatio: number = 1): Globals => {
  const localStorage = createLocalStorage()
  const getComputedStyle = window.getComputedStyle.bind(window)
  return {
    globalGlobals: {
      alert: Alert.alert,
      devicePixelRatio,
      getComputedStyle,
      innerHeight: height,
      innerWidth: width,
      localStorage,
    },
    windowGlobals: {
      alert: Alert.alert,
      devicePixelRatio,
      getComputedStyle,
      innerHeight: height,
      innerWidth: width,
    },
  }
}
