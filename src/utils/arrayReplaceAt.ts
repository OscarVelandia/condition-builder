export function arrayReplaceAt<T, UNewItem = T>(
  array: Array<T>,
  newItem: UNewItem,
  indexToReplace: number,
) {
  return array.map((item, index) => (index === indexToReplace ? newItem : item));
}
