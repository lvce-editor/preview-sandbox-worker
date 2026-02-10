import { expect, test } from '@jest/globals'
import * as DomEventListenersFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test.skip('renderEventListeners should return array with HandleClick and HandleInput event listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toEqual([
    {
      capture: true,
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleInput,
      params: ['handleInput', 'event.target.dataset.id', 'event.target.value'],
    },
  ])
})
