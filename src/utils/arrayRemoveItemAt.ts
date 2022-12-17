export function arrayRemoveItemAt<T>(array: Array<T>, index: number) {
  const arrayCopy = array.slice();

  arrayCopy.splice(index, 1);

  return arrayCopy;
}
