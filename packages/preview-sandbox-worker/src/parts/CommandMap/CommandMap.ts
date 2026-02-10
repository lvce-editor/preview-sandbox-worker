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
import { wrapCommand } from '../PreviewStates/PreviewStates.ts'
import { render2 } from '../Render2/Render2.ts'
import { rerender } from '../Rerender/Rerender.ts'
import { resize } from '../Resize/Resize.ts'

export const commandMap = {
  'PreviewSandBox.create': PreviewSandBox.create,
  'PreviewSandBox.diff2': diff2,
  'PreviewSandBox.executeCallback': executeCallback,
  'PreviewSandBox.handleClick': wrapCommand(HandleClick.handleClick),
  'PreviewSandBox.handleFileEdited': wrapCommand(handleFileEdited),
  'PreviewSandBox.handleInput': wrapCommand(HandleInput.handleInput),
  'PreviewSandBox.handleKeyDown': wrapCommand(HandleKeydown.handleKeydown),
  'PreviewSandBox.handleKeyUp': wrapCommand(HandleKeyup.handleKeyup),
  'PreviewSandBox.handleMessagePort': handleMessagePort,
  'PreviewSandBox.handleMousedown': wrapCommand(HandleMousedown.handleMousedown),
  'PreviewSandBox.handleMousemove': wrapCommand(HandleMousemove.handleMousemove),
  'PreviewSandBox.handleMouseup': wrapCommand(HandleMouseup.handleMouseup),
  'PreviewSandBox.loadContent': wrapCommand(LoadContent.loadContent),
  'PreviewSandBox.render2': render2,
  'PreviewSandBox.rerender': wrapCommand(rerender),
  'PreviewSandBox.resize': wrapCommand(resize),
  'PreviewSandBox.terminate': terminate,
}
