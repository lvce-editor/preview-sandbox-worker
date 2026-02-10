import { terminate } from '@lvce-editor/viewlet-registry'
import * as PreviewSandBox from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { executeCallback } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleFileEdited } from '../HandleFileEdited/HandleFileEdited.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeydown from '../HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../HandleKeyup/HandleKeyup.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleMousedown from '../HandleMousedown/HandleMousedown.ts'
import * as HandleMousemove from '../HandleMousemove/HandleMousemove.ts'
import * as HandleMouseup from '../HandleMouseup/HandleMouseup.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { render2 } from '../Render2/Render2.ts'
import { rerender } from '../Rerender/Rerender.ts'
import { resize } from '../Resize/Resize.ts'

export const commandMap = {
  'PreviewSandBox.create': PreviewSandBox.create,
  'PreviewSandBox.diff2': diff2,
  'PreviewSandBox.executeCallback': executeCallback,
  'PreviewSandBox.handleClick': HandleClick.handleClick,
  'PreviewSandBox.handleFileEdited': handleFileEdited,
  'PreviewSandBox.handleInput': HandleInput.handleInput,
  'PreviewSandBox.handleKeyDown': HandleKeydown.handleKeydown,
  'PreviewSandBox.handleKeyUp': HandleKeyup.handleKeyup,
  'PreviewSandBox.handleMessagePort': handleMessagePort,
  'PreviewSandBox.handleMousedown': HandleMousedown.handleMousedown,
  'PreviewSandBox.handleMousemove': HandleMousemove.handleMousemove,
  'PreviewSandBox.handleMouseup': HandleMouseup.handleMouseup,
  'PreviewSandBox.loadContent': LoadContent.loadContent,
  'PreviewSandBox.render2': render2,
  'PreviewSandBox.rerender': rerender,
  'PreviewSandBox.resize': resize,
  'PreviewSandBox.terminate': terminate,
  'SandBox.handleMessagePort': handleMessagePort,
}
