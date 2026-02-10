let idCounter = 0

export const create = (): number => {
  idCounter++
  return idCounter
}
