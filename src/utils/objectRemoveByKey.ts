import { SuccessRequestResponsePossibleValues } from '@services';

export function objectRemoveByKey<
  T extends Record<string | number, SuccessRequestResponsePossibleValues>,
>(object: T, key: string | number) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: removedElement, ...updatedObject } = object;

  return updatedObject;
}
