import { expect, describe, test } from '@jest/globals';
import {
  arrayInsertAt,
  arrayRemoveItemAt,
  arrayReplaceAt,
  ComparisonOperator,
  hasOnlyStringNumbers,
  isEmpty,
  logicalOperations,
  objectRemoveByKey,
} from '@utils';

describe('utils', () => {
  test('Insert element to array in the given index', () => {
    expect(arrayInsertAt(['a', 'b', 'd'], 'c', 2)).toEqual(['a', 'b', 'c', 'd']);
  });

  test('Remove array element in the given index', () => {
    expect(arrayRemoveItemAt(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
  });

  test('Replace array element in the given index', () => {
    expect(arrayReplaceAt(['a', 'd', 'c'], 'b', 1)).toEqual(['a', 'b', 'c']);
  });

  test('Check if text has only numbers', () => {
    expect(hasOnlyStringNumbers('0123')).toBe(true);
    expect(hasOnlyStringNumbers('2asd23')).toBe(false);
    expect(hasOnlyStringNumbers('asdf')).toBe(false);
  });

  test('Check if Array or object are empty', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('')).toBe(true);
  });

  test('Object with logical operators like contain, equals, greater than, less than, Not Contain and regex', () => {
    expect(logicalOperations[ComparisonOperator.Contain]('someText', 'e')).toBe(true);
    expect(logicalOperations[ComparisonOperator.Contain]('someText', 'w')).toBe(false);
    expect(logicalOperations[ComparisonOperator.Equals]('someText', 'someText')).toBe(true);
    expect(logicalOperations[ComparisonOperator.Equals]('someText', 'someOtherText')).toBe(false);
    expect(logicalOperations[ComparisonOperator.GreaterThan]('someText', 'someText')).toBe(false);
    expect(logicalOperations[ComparisonOperator.GreaterThan]('3', '4')).toBe(false);
    expect(logicalOperations[ComparisonOperator.GreaterThan]('4', '3')).toBe(true);
    expect(logicalOperations[ComparisonOperator.LessThan]('someText', 'someText')).toBe(false);
    expect(logicalOperations[ComparisonOperator.LessThan]('3', '4')).toBe(true);
    expect(logicalOperations[ComparisonOperator.LessThan]('4', '3')).toBe(false);
    expect(logicalOperations[ComparisonOperator.NotContain]('someText', 'some')).toBe(false);
    expect(logicalOperations[ComparisonOperator.NotContain]('someText', 'mos')).toBe(true);
    expect(logicalOperations[ComparisonOperator.Regex]('someText', 'ext')).toBe(true);
    expect(logicalOperations[ComparisonOperator.Regex]('someText', '123')).toBe(false);
  });

  test('Remove element from object by key', () => {
    expect(objectRemoveByKey({ a: 'a', b: 'b', c: 'c' }, 'b')).toEqual({ a: 'a', c: 'c' });
  });
});
