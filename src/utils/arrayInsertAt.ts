export function arrayInsertAt<T, UNewItem = T>(array: Array<T>, newItem: UNewItem, index: number) {
  return [...array.slice(0, index), newItem, ...array.slice(index)];
}
