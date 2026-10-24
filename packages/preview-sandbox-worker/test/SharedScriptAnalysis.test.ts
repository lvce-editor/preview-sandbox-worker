import { parse } from '@babel/parser'
import { expect, jest, test } from '@jest/globals'
import { analyzeScript, createScriptAnalyzer } from '../src/parts/AnalyzeScript/AnalyzeScript.ts'
import { getCanvasCreationCount } from '../src/parts/GetCanvasCreationCount/GetCanvasCreationCount.ts'
import { getTopLevelVariableNames } from '../src/parts/GetTopLevelVariableNames/GetTopLevelVariableNames.ts'

test('canvas reservation and script execution share one analysis of each script', () => {
  const parseScript = jest.fn(parse)
  const analyze = createScriptAnalyzer(parseScript)
  const library = `var library = { create: () => document.createElement('canvas') }`
  const scene = `var [canvas] = [library.create()]`
  const scripts = [library, scene]

  // updateContent reserves canvases before executeScripts exposes top-level vars.
  expect(scripts.map(analyze).reduce((count, result) => count + result.canvasCreationCount, 0)).toBe(1)
  expect(scripts.map((script) => analyze(script).topLevelVariableNames)).toEqual([['library'], ['canvas']])
  expect(parseScript).toHaveBeenCalledTimes(2)

  // Replacing only the scene must not reparse the fixed library.
  const editedScene = `${scene}; document.createElementNS('namespace', 'canvas')`
  expect(analyze(library).canvasCreationCount + analyze(editedScene).canvasCreationCount).toBe(2)
  expect(analyze(editedScene).topLevelVariableNames).toEqual(['canvas'])
  expect(analyze(library).topLevelVariableNames).toEqual(['library'])
  expect(parseScript).toHaveBeenCalledTimes(3)
})

test('canvas and variable consumers use the same cached summary', () => {
  const script = "var canvas = document.createElement('canvas')"
  expect(getCanvasCreationCount([script])).toBe(1)
  expect(getTopLevelVariableNames(script)).toBe(analyzeScript(script).topLevelVariableNames)
})
