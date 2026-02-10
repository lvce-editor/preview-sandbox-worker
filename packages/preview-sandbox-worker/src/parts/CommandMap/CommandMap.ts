import { terminate } from '@lvce-editor/viewlet-registry'
import * as SandBox from '../Create/Create.ts'
import { executeCallback } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { getSerializedDom } from '../GetSerializedDom/GetSerializedDom.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeydown from '../HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../HandleKeyup/HandleKeyup.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleMousedown from '../HandleMousedown/HandleMousedown.ts'
import * as HandleMousemove from '../HandleMousemove/HandleMousemove.ts'
import * as HandleMouseup from '../HandleMouseup/HandleMouseup.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { resize } from '../Resize/Resize.ts'

export const commandMap = {
  'SandBox.create': SandBox.create,
  'SandBox.executeCallback': executeCallback,
  'SandBox.getSerializedDom': getSerializedDom,
  'SandBox.handleClick': HandleClick.handleClick,
  'SandBox.handleInput': HandleInput.handleInput,
  'SandBox.handleKeyDown': HandleKeydown.handleKeydown,
  'SandBox.handleKeyUp': HandleKeyup.handleKeyup,
  'SandBox.handleMessagePort': handleMessagePort,
  'SandBox.handleMousedown': HandleMousedown.handleMousedown,
  'SandBox.handleMousemove': HandleMousemove.handleMousemove,
  'SandBox.handleMouseup': HandleMouseup.handleMouseup,
  'SandBox.loadContent': LoadContent.loadContent,
  'SandBox.resize': resize,
  'SandBox.terminate': terminate,
}
