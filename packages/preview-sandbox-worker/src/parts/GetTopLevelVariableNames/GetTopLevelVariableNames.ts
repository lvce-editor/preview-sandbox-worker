import { analyzeScript } from '../AnalyzeScript/AnalyzeScript.ts'

export const getTopLevelVariableNames = (script: string): readonly string[] => {
  return analyzeScript(script).topLevelVariableNames
}
