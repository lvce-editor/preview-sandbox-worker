import * as CanvasState from '../CanvasState/CanvasState.ts'
import * as GeometryState from '../GeometryState/GeometryState.ts'
import * as HappyDomState from '../HappyDomState/HappyDomState.ts'
import * as ObserveDom from '../ObserveDom/ObserveDom.ts'
import * as RuntimeDiagnostics from '../RuntimeDiagnostics/RuntimeDiagnostics.ts'

export const dispose = (uid: number): void => {
  ObserveDom.disconnect(uid)
  CanvasState.remove(uid)
  GeometryState.remove(uid)
  HappyDomState.remove(uid)
  RuntimeDiagnostics.clear(uid)
}
