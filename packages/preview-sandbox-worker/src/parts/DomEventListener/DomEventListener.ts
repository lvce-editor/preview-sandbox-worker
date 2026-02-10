export interface DomEventListener {
  readonly capture?: boolean
  readonly name: string | number
  readonly params: readonly (string | number)[]
  readonly passive?: boolean
  readonly preventDefault?: boolean
}
