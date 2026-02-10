import { expect, test } from '@jest/globals'
import * as ExecuteScripts from '../src/parts/CreateWindowAndExecuteScripts/CreateWindowAndExecuteScripts.ts'
import * as DispatchClickEvent from '../src/parts/DispatchClickEvent/DispatchClickEvent.ts'

test('executeScripts should return a document and window', () => {
  const result = ExecuteScripts.createWindowAndExecuteScripts('<html><body><div>hello</div></body></html>', [])
  expect(result.document).toBeDefined()
  expect(result.document.body).toBeDefined()
  expect(result.window).toBeDefined()
})

test('executeScripts should execute script that modifies textContent', () => {
  const html = '<html><body><div id="target">before</div></body></html>'
  const scripts = ['document.getElementById("target").textContent = "after"']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const target = doc.querySelector('#target')
  expect(target).toBeDefined()
  expect(target.textContent).toBe('after')
})

test('executeScripts should execute script that modifies innerHTML', () => {
  const html = '<html><body><div id="container"></div></body></html>'
  const scripts = ['document.getElementById("container").innerHTML = "<p>dynamic</p>"']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const container = doc.querySelector('#container')
  expect(container.innerHTML).toBe('<p>dynamic</p>')
})

test('executeScripts should execute multiple scripts in order', () => {
  const html = '<html><body><div id="result"></div></body></html>'
  const scripts = ['document.getElementById("result").textContent = "step1"', 'document.getElementById("result").textContent += ",step2"']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#result').textContent).toBe('step1,step2')
})

test('executeScripts should handle script that creates new elements', () => {
  const html = '<html><body><ul id="list"></ul></body></html>'
  const scripts = [
    `
    const list = document.getElementById("list");
    for (let i = 0; i < 3; i++) {
      const li = document.createElement("li");
      li.textContent = "Item " + i;
      list.appendChild(li);
    }
    `,
  ]
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const list = doc.querySelector('#list')
  expect(list.children.length).toBe(3)
  expect(list.children[0].textContent).toBe('Item 0')
  expect(list.children[1].textContent).toBe('Item 1')
  expect(list.children[2].textContent).toBe('Item 2')
})

test('executeScripts should handle script that removes elements', () => {
  const html = '<html><body><div id="parent"><span id="child">remove me</span></div></body></html>'
  const scripts = ['document.getElementById("child").remove()']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#child')).toBeNull()
  expect(doc.querySelector('#parent').children.length).toBe(0)
})

test('executeScripts should handle script that modifies classes', () => {
  const html = '<html><body><div id="box" class="red"></div></body></html>'
  const scripts = [
    `
    const box = document.getElementById("box");
    box.classList.remove("red");
    box.classList.add("blue", "large");
    `,
  ]
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const box = doc.querySelector('#box')
  expect(box.classList.contains('blue')).toBe(true)
  expect(box.classList.contains('large')).toBe(true)
  expect(box.classList.contains('red')).toBe(false)
})

test('executeScripts should handle script that modifies attributes', () => {
  const html = '<html><body><img id="img" src="old.png"></body></html>'
  const scripts = ['document.getElementById("img").setAttribute("src", "new.png")']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#img').getAttribute('src')).toBe('new.png')
})

test('executeScripts should handle script with querySelector', () => {
  const html = '<html><body><div class="card"><h2>Title</h2><p>Content</p></div></body></html>'
  const scripts = ['document.querySelector(".card h2").textContent = "New Title"']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('.card h2').textContent).toBe('New Title')
})

test('executeScripts should handle script with querySelectorAll', () => {
  const html = '<html><body><ul><li>A</li><li>B</li><li>C</li></ul></body></html>'
  const scripts = [
    `document.querySelectorAll("li").forEach((el, i) => {
      el.textContent = "Item " + (i + 1);
    })`,
  ]
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const items = doc.querySelectorAll('li')
  expect(items[0].textContent).toBe('Item 1')
  expect(items[1].textContent).toBe('Item 2')
  expect(items[2].textContent).toBe('Item 3')
})

test('executeScripts should survive script errors gracefully', () => {
  const html = '<html><body><div id="ok">original</div></body></html>'
  const scripts = ['throw new Error("intentional error")', 'document.getElementById("ok").textContent = "still works"']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  // Second script should still run despite first throwing
  expect(doc.querySelector('#ok').textContent).toBe('still works')
})

test('executeScripts should handle empty scripts array', () => {
  const html = '<html><body><div>unchanged</div></body></html>'
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, [])
  expect(doc.body.querySelector('div').textContent).toBe('unchanged')
})

test('executeScripts should provide window object to scripts', () => {
  const html = '<html><body><div id="result"></div></body></html>'
  const scripts = ['document.getElementById("result").textContent = typeof window']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#result').textContent).toBe('object')
})

test('executeScripts should handle script that changes styles', () => {
  const html = '<html><body><div id="styled"></div></body></html>'
  const scripts = ['document.getElementById("styled").style.color = "red"']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#styled').style.color).toBe('red')
})

test('executeScripts should handle script with toggle visibility', () => {
  const html = '<html><body><div id="menu" class="hidden">Menu Content</div><button id="toggle">Toggle</button></body></html>'
  const scripts = [
    `
    const menu = document.getElementById("menu");
    menu.classList.remove("hidden");
    menu.classList.add("visible");
    `,
  ]
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const menu = doc.querySelector('#menu')
  expect(menu.classList.contains('visible')).toBe(true)
  expect(menu.classList.contains('hidden')).toBe(false)
})

test('executeScripts should handle script that builds a table', () => {
  const html = '<html><body><table id="table"><thead><tr><th>Name</th><th>Age</th></tr></thead><tbody id="tbody"></tbody></table></body></html>'
  const scripts = [
    `
    const tbody = document.getElementById("tbody");
    const data = [["Alice", 30], ["Bob", 25]];
    for (const [name, age] of data) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.textContent = name;
      const td2 = document.createElement("td");
      td2.textContent = age;
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    }
    `,
  ]
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const rows = doc.querySelectorAll('#tbody tr')
  expect(rows.length).toBe(2)
  expect(rows[0].children[0].textContent).toBe('Alice')
  expect(rows[1].children[0].textContent).toBe('Bob')
})

test('executeScripts should handle counter pattern', () => {
  const html = '<html><body><span id="count">0</span></body></html>'
  const scripts = [
    `
    const countEl = document.getElementById("count");
    let count = parseInt(countEl.textContent);
    count++;
    count++;
    count++;
    countEl.textContent = count.toString();
    `,
  ]
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#count').textContent).toBe('3')
})

test('executeScripts with dispatchClickEvent should execute onclick handler and update textContent', () => {
  const html = '<html><body><button id="btn" onclick="someFunction(2)">Click me</button></body></html>'
  const scripts = [
    `
    window.someFunction = function(value) {
      document.getElementById("btn").textContent = value;
    };
    `,
  ]
  const { document: doc, window } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const button = doc.querySelector('#btn')

  // Initial state
  expect(button.textContent).toBe('Click me')

  // Dispatch click event
  DispatchClickEvent.dispatchClickEvent(button, window)

  // Verify textContent was updated by the onclick handler
  expect(button.textContent).toBe('2')
})

test('executeScripts with dispatchClickEvent should execute onclick handler and update textContent 2', () => {
  const html = '<html><body><button id="btn" onclick="someFunction(2)">Click me</button></body></html>'
  const scripts = [
    `
    function someFunction(value) {
      document.getElementById("btn").textContent = value;
    };
    `,
  ]
  const { document: doc, window } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  const button = doc.querySelector('#btn')

  // Initial state
  expect(button.textContent).toBe('Click me')

  // Dispatch click event
  DispatchClickEvent.dispatchClickEvent(button, window)

  // Verify textContent was updated by the onclick handler
  expect(button.textContent).toBe('2')
})

test('executeScripts should set window.innerWidth and window.innerHeight', () => {
  const html = '<html><body><div id="result"></div></body></html>'
  const scripts = ['document.getElementById("result").textContent = window.innerWidth + "x" + window.innerHeight']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts, 800, 600)
  expect(doc.querySelector('#result').textContent).toBe('800x600')
})

test('executeScripts should set globalThis.innerWidth and globalThis.innerHeight', () => {
  const html = '<html><body><div id="result"></div></body></html>'
  const scripts = ['document.getElementById("result").textContent = globalThis.innerWidth + "x" + globalThis.innerHeight']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts, 1024, 768)
  expect(doc.querySelector('#result').textContent).toBe('1024x768')
})

test('executeScripts should have default innerWidth and innerHeight of 0', () => {
  const html = '<html><body><div id="result"></div></body></html>'
  const scripts = ['document.getElementById("result").textContent = window.innerWidth + "x" + window.innerHeight']
  const { document: doc } = ExecuteScripts.createWindowAndExecuteScripts(html, scripts)
  expect(doc.querySelector('#result').textContent).toBe('0x0')
})
