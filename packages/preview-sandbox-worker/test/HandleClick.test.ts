import { afterEach, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'
import * as HappyDomState from '../src/parts/HappyDomState/HappyDomState.ts'
import * as SerializeHappyDom from '../src/parts/SerializeHappyDom/SerializeHappyDom.ts'

const createState = (uid: number, overrides: Partial<PreviewState> = {}): PreviewState => ({
  ...createDefaultState(),
  assetDir: '',
  content: '',
  css: [],
  errorCount: 0,
  errorMessage: '',
  initial: false,
  parsedDom: [],
  parsedNodesChildNodeCount: 0,
  platform: 0,
  scripts: [],
  uid,
  uri: '',
  useSandboxWorker: false,
  warningCount: 0,
  ...overrides,
})

const setupHappyDom = (uid: number, html: string, scripts: readonly string[]): void => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = html

  for (const scriptContent of scripts) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function('window', 'document', 'console', scriptContent)
    fn(window, document, console)
  }

  const elementMap = new Map<string, any>()
  SerializeHappyDom.serialize(document, elementMap)
  HappyDomState.set(uid, { document, elementMap, window })
}

afterEach(() => {
  HappyDomState.remove(1)
})

test('handleClick should return state unchanged when hdId is empty', async () => {
  const state = createState(1)
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should return state unchanged when no happy-dom state exists', async () => {
  const state = createState(1)
  const result = await HandleClick.handleClick(state, '0')
  expect(result).toBe(state)
})

test('handleClick should return state unchanged when element not found in map', async () => {
  setupHappyDom(1, '<body><div>hello</div></body>', [])
  const state = createState(1)
  const result = await HandleClick.handleClick(state, '999')
  expect(result).toBe(state)
})

test('handleClick should dispatch click and update state for counter pattern', async () => {
  const html = '<body><span id="count">0</span><button id="btn">Click</button></body>'
  const scripts = [
    `
    const countEl = document.getElementById("count");
    const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      let count = parseInt(countEl.textContent);
      count++;
      countEl.textContent = count.toString();
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  // Find the button's hdId in the element map
  let buttonHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'btn') {
      buttonHdId = hdId
      break
    }
  }
  expect(buttonHdId).not.toBe('')

  const state = createState(1)
  const result = await HandleClick.handleClick(state, buttonHdId)

  // parsedDom should have changed
  expect(result).not.toBe(state)
  expect(result.parsedDom).not.toBe(state.parsedDom)

  // Find the text node with the counter value
  const textNode = result.parsedDom.find((n: any) => n.text === '1')
  expect(textNode).toBeDefined()
})

test('handleClick should handle multiple clicks incrementing counter', async () => {
  const html = '<body><span id="count">0</span><button id="btn">Click</button></body>'
  const scripts = [
    `
    const countEl = document.getElementById("count");
    const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
      let count = parseInt(countEl.textContent);
      count++;
      countEl.textContent = count.toString();
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  let buttonHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'btn') {
      buttonHdId = hdId
      break
    }
  }

  let state = createState(1)

  // Click 3 times
  state = await HandleClick.handleClick(state, buttonHdId)
  // After first click, need to get the NEW button hdId from the updated element map
  let instance = HappyDomState.get(1)!
  for (const [hdId, element] of instance.elementMap) {
    if (element.id === 'btn') {
      buttonHdId = hdId
      break
    }
  }
  state = await HandleClick.handleClick(state, buttonHdId)
  instance = HappyDomState.get(1)!
  for (const [hdId, element] of instance.elementMap) {
    if (element.id === 'btn') {
      buttonHdId = hdId
      break
    }
  }
  state = await HandleClick.handleClick(state, buttonHdId)

  const textNode = state.parsedDom.find((n: any) => n.text === '3')
  expect(textNode).toBeDefined()
})

test('handleClick should handle click event bubbling', async () => {
  const html = '<body><div id="parent"><button id="child">Click</button></div></body>'
  const scripts = [
    `
    const parent = document.getElementById("parent");
    parent.addEventListener("click", () => {
      parent.setAttribute("class", "clicked");
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  // Click on the child button, event should bubble up to parent
  let childHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'child') {
      childHdId = hdId
      break
    }
  }

  const state = createState(1)
  const result = await HandleClick.handleClick(state, childHdId)

  // Parent should now have class="clicked"
  const parentNode = result.parsedDom.find((n: any) => n.className === 'clicked')
  expect(parentNode).toBeDefined()
})

test('handleClick should handle toggle visibility', async () => {
  const html = '<body><div id="content" class="hidden">Content</div><button id="toggle">Toggle</button></body>'
  const scripts = [
    `
    const content = document.getElementById("content");
    const toggle = document.getElementById("toggle");
    toggle.addEventListener("click", () => {
      if (content.classList.contains("hidden")) {
        content.classList.remove("hidden");
        content.classList.add("visible");
      } else {
        content.classList.remove("visible");
        content.classList.add("hidden");
      }
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  let toggleHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'toggle') {
      toggleHdId = hdId
      break
    }
  }

  const state = createState(1)
  const result = await HandleClick.handleClick(state, toggleHdId)

  // Content should now have class="visible" instead of "hidden"
  const contentNode = result.parsedDom.find((n: any) => n.className === 'visible')
  expect(contentNode).toBeDefined()
  const hiddenNode = result.parsedDom.find((n: any) => n.className === 'hidden')
  expect(hiddenNode).toBeUndefined()
})

test('handleClick should update parsedNodesChildNodeCount', async () => {
  const html = '<body><ul id="list"></ul><button id="add">Add</button></body>'
  const scripts = [
    `
    const list = document.getElementById("list");
    const addBtn = document.getElementById("add");
    addBtn.addEventListener("click", () => {
      const li = document.createElement("li");
      li.textContent = "Item " + (list.children.length + 1);
      list.appendChild(li);
    });
    `,
  ]
  setupHappyDom(1, html, scripts)

  const happyDomInstance = HappyDomState.get(1)!
  let addHdId = ''
  for (const [hdId, element] of happyDomInstance.elementMap) {
    if (element.id === 'add') {
      addHdId = hdId
      break
    }
  }

  const state = createState(1)
  const result = await HandleClick.handleClick(state, addHdId)

  expect(result.parsedNodesChildNodeCount).toBeGreaterThan(0)
})
