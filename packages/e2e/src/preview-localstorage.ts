import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'preview.localstorage'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const filePath = `${tmpDir}/preview-test-localstorage.html`
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>LocalStorage Test</title>
</head>
<body>
  <div id="result">initial</div>
  <button id="setBtn">Set Item</button>
  <button id="getBtn">Get Item</button>
  <button id="clearBtn">Clear</button>

  <script>
    // Set item in localStorage and update DOM
    document.getElementById('setBtn').addEventListener('click', function() {
      localStorage.setItem('testKey', 'testValue');
      document.getElementById('result').textContent = 'item set';
    });

    // Get item from localStorage and display it
    document.getElementById('getBtn').addEventListener('click', function() {
      const value = localStorage.getItem('testKey');
      document.getElementById('result').textContent = value || 'not found';
    });

    // Clear localStorage
    document.getElementById('clearBtn').addEventListener('click', function() {
      localStorage.clear();
      document.getElementById('result').textContent = 'cleared';
    });

    // Initialize on page load
    window.addEventListener('load', function() {
      const existingValue = localStorage.getItem('testKey');
      if (existingValue) {
        document.getElementById('result').textContent = existingValue;
      }
    });
  </script>
</body>
</html>`

  await FileSystem.writeFile(filePath, html)
  await Main.openUri(filePath)

  // act & assert - Open preview
  await Command.execute('Layout.showPreview', filePath)
  const previewArea = Locator('.Viewlet.Preview')
  await expect(previewArea).toBeVisible()
  const resultDiv = previewArea.locator('#result')
  await expect(resultDiv).toBeVisible()
  await expect(resultDiv).toContainText('initial')

  // Test setting an item
  const setBtn = previewArea.locator('#setBtn')
  await expect(setBtn).toBeVisible()
  await Command.execute('Preview.handleClick', '1')
  await expect(resultDiv).toContainText('item set')

  // Test getting the item back
  const getBtn = previewArea.locator('#getBtn')
  await expect(getBtn).toBeVisible()
  await Command.execute('Preview.handleClick', '2')
  await expect(resultDiv).toContainText('testValue')

  // Test clearing localStorage
  const clearBtn = previewArea.locator('#clearBtn')
  await expect(clearBtn).toBeVisible()
  await Command.execute('Preview.handleClick', '3')
  await expect(resultDiv).toContainText('cleared')

  // Verify it's actually cleared by trying to get the item again
  await Command.execute('Preview.handleClick', '2')
  await expect(resultDiv).toContainText('not found')
}
