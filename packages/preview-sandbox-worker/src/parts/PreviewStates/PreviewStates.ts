import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const { get, getCommandIds, getKeys, registerCommands, set, wrapCommand, wrapGetter } = ViewletRegistry.create<PreviewState>()
