import { terminate } from '@lvce-editor/viewlet-registry'
import * as GetSerializedDom from '../GetSerializedDom/GetSerializedDom.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeydown from '../HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../HandleKeyup/HandleKeyup.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import { initializeSandbox } from '../InitializeSandbox/InitializeSandbox.ts'

export const commandMap = {
  'SandBox.getSerializedDom': GetSerializedDom.getSerializedDom,
  'SandBox.handleClick': HandleClick.handleClick,
  'SandBox.handleInput': HandleInput.handleInput,
  'SandBox.handleKeyDown': HandleKeydown.handleKeydown,
  'SandBox.handleKeyUp': HandleKeyup.handleKeyup,
  'SandBox.handleMessagePort': handleMessagePort,
  'SandBox.initialize': initializeSandbox,
  'SandBox.terminate': terminate,
}
