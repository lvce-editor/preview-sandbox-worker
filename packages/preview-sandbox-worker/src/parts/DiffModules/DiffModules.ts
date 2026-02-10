import * as DiffCss from '../DiffCss/DiffCss.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const modules = [DiffItems.isEqual, DiffCss.iEqual]

export const numbers = [DiffType.RenderIncremental, DiffType.RenderCss]
