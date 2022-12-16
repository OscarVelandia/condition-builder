import { SuccessResponsePossibleValues } from '@services';

export enum ComparisonOperator {
  Contain = 'Contain',
  Equals = 'Equals',
  GreaterThan = 'Greater Than',
  LessThan = 'Less Than',
  NotContain = 'NotContain',
  Regex = 'Regex',
}

export const comparisonOperations = {
  [ComparisonOperator.Contain]: (a: SuccessResponsePossibleValues, b: string) =>
    typeof a === 'string' ? a.includes(b) : false,
  [ComparisonOperator.Equals]: (a: SuccessResponsePossibleValues, b: string) => a === b,
  [ComparisonOperator.GreaterThan]: (a: SuccessResponsePossibleValues, b: string) =>
    Number(a) > Number(b),
  [ComparisonOperator.LessThan]: (a: SuccessResponsePossibleValues, b: string) =>
    Number(a) < Number(b),
  [ComparisonOperator.NotContain]: (a: SuccessResponsePossibleValues, b: string) =>
    typeof a === 'string' ? !a.includes(b) : false,
  [ComparisonOperator.Regex]: (a: SuccessResponsePossibleValues, regex: string) =>
    typeof a === 'string' ? new RegExp(`${regex}`).test(a) : false,
};
