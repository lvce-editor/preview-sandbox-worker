import { analyzeScript } from '../AnalyzeScript/AnalyzeScript.ts'

export const getCanvasCreationCount = (scripts: readonly string[]): number => {
  let count = 0
  for (const script of scripts) {
    count += analyzeScript(script).canvasCreationCount
  }
  return count
}
