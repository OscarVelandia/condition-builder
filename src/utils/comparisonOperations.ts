export enum ComparisonOperator {
  Contain = 'Contain',
  Equals = 'Equals',
  GreaterThan = 'Greater Than',
  LessThan = 'Less Than',
  NotContain = 'NotContain',
  Regex = 'Regex',
}

export const comparisonOperations = {
  [ComparisonOperator.Contain]: (a: string, b: string) => a.includes(b),
  [ComparisonOperator.Equals]: (a: string, b: string) => a === b,
  [ComparisonOperator.GreaterThan]: (a: string, b: string) => Number(a) > Number(b),
  [ComparisonOperator.LessThan]: (a: string, b: string) => Number(a) < Number(b),
  [ComparisonOperator.NotContain]: (a: string, b: string) => !a.includes(b),
  [ComparisonOperator.Regex]: (a: string, regex: string) => new RegExp(`${regex}`).test(a),
};
