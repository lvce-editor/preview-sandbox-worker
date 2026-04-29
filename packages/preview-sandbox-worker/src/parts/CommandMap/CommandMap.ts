import { terminate } from '@lvce-editor/viewlet-registry'
import { executeCallback } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { getSerializedDom } from '../GetSerializedDom/GetSerializedDom.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleContextmenu from '../HandleContextmenu/HandleContextmenu.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeydown from '../HandleKeydown/HandleKeydown.ts'
import * as HandleKeyup from '../HandleKeyup/HandleKeyup.ts'
import { handleMessagePort } from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleMousedown from '../HandleMousedown/HandleMousedown.ts'
import * as HandleMouseleave from '../HandleMouseleave/HandleMouseleave.ts'
import * as HandleMousemove from '../HandleMousemove/HandleMousemove.ts'
import * as HandleMouseout from '../HandleMouseout/HandleMouseout.ts'
import * as HandleMouseover from '../HandleMouseover/HandleMouseover.ts'
import * as HandleMouseup from '../HandleMouseup/HandleMouseup.ts'
import * as HandlePointerdown from '../HandlePointerdown/HandlePointerdown.ts'
import * as HandlePointermove from '../HandlePointermove/HandlePointermove.ts'
import * as HandlePointerout from '../HandlePointerout/HandlePointerout.ts'
import * as HandlePointerover from '../HandlePointerover/HandlePointerover.ts'
import * as HandlePointerup from '../HandlePointerup/HandlePointerup.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { resize } from '../Resize/Resize.ts'

export const commandMap = {
  'SandBox.executeCallback': executeCallback,
  'SandBox.getSerializedDom': getSerializedDom,
  'SandBox.handleClick': HandleClick.handleClick,
  'SandBox.handleContextMenu': HandleContextmenu.handleContextmenu,
  'SandBox.handleInput': HandleInput.handleInput,
  'SandBox.handleKeyDown': HandleKeydown.handleKeydown,
  'SandBox.handleKeyUp': HandleKeyup.handleKeyup,
  'SandBox.handleMessagePort': handleMessagePort,
  'SandBox.handleMousedown': HandleMousedown.handleMousedown,
  'SandBox.handleMouseleave': HandleMouseleave.handleMouseleave,
  'SandBox.handleMousemove': HandleMousemove.handleMousemove,
  'SandBox.handleMouseout': HandleMouseout.handleMouseout,
  'SandBox.handleMouseover': HandleMouseover.handleMouseover,
  'SandBox.handleMouseup': HandleMouseup.handleMouseup,
  'SandBox.handlePointerdown': HandlePointerdown.handlePointerdown,
  'SandBox.handlePointermove': HandlePointermove.handlePointermove,
  'SandBox.handlePointerout': HandlePointerout.handlePointerout,
  'SandBox.handlePointerover': HandlePointerover.handlePointerover,
  'SandBox.handlePointerup': HandlePointerup.handlePointerup,
  'SandBox.loadContent': LoadContent.loadContent,
  'SandBox.resize': resize,
  'SandBox.terminate': terminate,
}
