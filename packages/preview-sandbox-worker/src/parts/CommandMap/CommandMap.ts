import { terminate } from '@lvce-editor/viewlet-registry'
import * as PreviewSandBox from '../Create/Create.ts'
import { executeCallback } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeydown from '../HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../HandleKeyup/HandleKeyup.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleMousedown from '../HandleMousedown/HandleMousedown.ts'
import * as HandleMousemove from '../HandleMousemove/HandleMousemove.ts'
import * as HandleMouseup from '../HandleMouseup/HandleMouseup.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { rerender } from '../Rerender/Rerender.ts'
import { resize } from '../Resize/Resize.ts'

export const commandMap = {
  'PreviewSandBox.create': PreviewSandBox.create,
  'PreviewSandBox.executeCallback': executeCallback,
  'PreviewSandBox.handleClick': HandleClick.handleClick,
  'PreviewSandBox.handleInput': HandleInput.handleInput,
  'PreviewSandBox.handleKeyDown': HandleKeydown.handleKeydown,
  'PreviewSandBox.handleKeyUp': HandleKeyup.handleKeyup,
  'PreviewSandBox.handleMessagePort': handleMessagePort,
  'PreviewSandBox.handleMousedown': HandleMousedown.handleMousedown,
  'PreviewSandBox.handleMousemove': HandleMousemove.handleMousemove,
  'PreviewSandBox.handleMouseup': HandleMouseup.handleMouseup,
  'PreviewSandBox.loadContent': LoadContent.loadContent,
  'PreviewSandBox.resize': resize,
  'PreviewSandBox.terminate': terminate,
  'SandBox.handleMessagePort': handleMessagePort,
}
