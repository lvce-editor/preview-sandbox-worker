/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Window } from 'happy-dom-without-node'
import * as Alert from '../Alert/Alert.ts'
import { createLocalStorage } from '../LocalStorage/LocalStorage.ts'

export interface Globals {
  globalGlobals: {
    alert: typeof Alert.alert
    cancelAnimationFrame: Window['cancelAnimationFrame']
    clearInterval: Window['clearInterval']
    clearTimeout: Window['clearTimeout']
    devicePixelRatio: number
    getComputedStyle: Window['getComputedStyle']
    innerHeight: number
    innerWidth: number
    localStorage: ReturnType<typeof createLocalStorage>
    requestAnimationFrame: Window['requestAnimationFrame']
    setInterval: Window['setInterval']
    setTimeout: Window['setTimeout']
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
      cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
      clearInterval: window.clearInterval.bind(window),
      clearTimeout: window.clearTimeout.bind(window),
      devicePixelRatio,
      getComputedStyle,
      innerHeight: height,
      innerWidth: width,
      localStorage,
      requestAnimationFrame: window.requestAnimationFrame.bind(window),
      setInterval: window.setInterval.bind(window),
      setTimeout: window.setTimeout.bind(window),
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
