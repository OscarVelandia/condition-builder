import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SuccessResponse, SuccessResponsePossibleValues } from '@services';
import { arrayInsertAt, arrayReplaceAt, isNumberString } from '@utils';
import {
  AddConditionConfig,
  FormLoading,
  FormRow,
  InputConfigName,
  LeftInputConditionConfig,
  OperatorInputConfig,
  ValueInputConfig,
} from '@features/conditionBuilder';

const texts = {
  and: 'And',
  capsAnd: 'AND',
};

export enum ComparisonOperator {
  Contain = 'Contain',
  Equals = 'Equals',
  GreaterThan = 'Greater Than',
  LessThan = 'Less Than',
  NotContain = 'NotContain',
  Regex = 'Regex',
}

type AndConditionIndexToUpdate = number;
type OrConditionIndexToUpdate = number;
type CompleteFormRowConditions = {
  [key: AndConditionIndexToUpdate]: {
    [key: OrConditionIndexToUpdate]: {
      columnName: string;
      inputValueAndIndex: number;
      inputValueOrIndex: number;
      operation: (columnValue: SuccessResponsePossibleValues) => (inputValue: string) => boolean;
    };
  };
};

type IsLoadingCondition = { isLoading: true };
type ConditionRow = {
  leftConditionConfig: Omit<LeftInputConditionConfig, 'onChange'>;
  operatorConfig: Omit<OperatorInputConfig, 'onChange'>;
  valueInputConfig: Omit<ValueInputConfig, 'onChange'>;
};
type ConditionRowOrIsLoading = ConditionRow | IsLoadingCondition;

const comparisonOperations = {
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

interface Props {
  onResponseUpdate: (updatedResponse: Record<string, SuccessResponsePossibleValues>[]) => void;
  response: SuccessResponse;
}

export function ConditionsForm({ onResponseUpdate, response }: Props) {
  const [defaultCondition, setDefaultCondition] = useState<ConditionRow | null>(null);
  const [conditions, setConditions] = useState<Array<Array<ConditionRowOrIsLoading>>>([]);
  const [completeFormRowConditions, setCompleteFormRowConditions] =
    useState<CompleteFormRowConditions>([]);
  const onlyNumberOperators = [ComparisonOperator.GreaterThan, ComparisonOperator.LessThan];

  useEffect(() => {
    const leftConditionConfig: Omit<LeftInputConditionConfig, 'onChange'> = {
      options: Object.keys(response[0]),
      value: Object.keys(response[0])[0],
    };
    const operatorConfig: Omit<OperatorInputConfig, 'onChange'> = {
      options: Object.values(ComparisonOperator),
      value: ComparisonOperator.Equals,
    };
    const valueInputConfig: Omit<ValueInputConfig, 'onChange'> = { value: '' };
    const defaultConditionsConfig = { leftConditionConfig, operatorConfig, valueInputConfig };

    setConditions([[defaultConditionsConfig]]);
    setDefaultCondition(defaultConditionsConfig);
  }, [response]);

  const addConditionConfig = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ): AddConditionConfig => {
    return {
      onClick: () => {
        if (!defaultCondition) return;

        setConditions((oldConditions) => {
          const updatedOrConditions = arrayInsertAt<ConditionRowOrIsLoading>(
            oldConditions[andIndex],
            defaultCondition,
            orIndex + 1,
          )
            // Remove isLoading elements
            .filter((condition) => !('isLoading' in condition));

          return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
        });
      },
      onHover: () => {
        const orConditionToInsertIndex = orIndex + 1;

        setConditions((oldConditions) => {
          const updatedOrConditions = arrayInsertAt<ConditionRowOrIsLoading>(
            oldConditions[andIndex],
            { isLoading: true },
            orConditionToInsertIndex,
          );

          return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
        });
      },
      onBlur: () => {
        setConditions((oldConditions) => {
          const updatedOrConditions = oldConditions[andIndex].filter(
            (oldCondition) => !('isLoading' in oldCondition),
          );

          return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
        });
      },
    };
  };

  const shouldFilterResponse = (updatedConditions: Array<ConditionRow>, indexToCheck: number) => {
    const conditionsToUpdate = updatedConditions[indexToCheck];
    const { leftConditionConfig, operatorConfig, valueInputConfig } = conditionsToUpdate;

    return leftConditionConfig.value && operatorConfig.value && valueInputConfig.value !== '';
  };

  const addCompleteConditionsOperations = (
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ): CompleteFormRowConditions => {
    const conditionRow = conditions as Array<Array<ConditionRow>>;
    const selectedCondition = conditionRow[andConditionIndexToUpdate][orConditionIndexToUpdate];
    const operator = selectedCondition.operatorConfig.value;
    const columnName = selectedCondition.leftConditionConfig.value;
    const updatedConditions: CompleteFormRowConditions = {
      ...completeFormRowConditions,
      [andConditionIndexToUpdate]: {
        ...completeFormRowConditions[andConditionIndexToUpdate],
        [orConditionIndexToUpdate]: {
          columnName,
          inputValueAndIndex: andConditionIndexToUpdate,
          inputValueOrIndex: orConditionIndexToUpdate,
          operation: (column) => (inputValue) => {
            return comparisonOperations[operator](column as string, inputValue);
          },
        },
      },
    };

    setCompleteFormRowConditions(updatedConditions);

    return updatedConditions;
  };

  const filterResponse = (
    formRowConditions: CompleteFormRowConditions,
    updatedConditions: Array<Array<ConditionRow>>,
  ) => {
    const andConditions = Object.values(formRowConditions);
    const orConditions = andConditions.map((condition) => Object.values(condition));

    const updatedResponse = response.filter((data) => {
      return orConditions.every((orCondition) => {
        return orCondition.some(
          ({ columnName, inputValueAndIndex, inputValueOrIndex, operation }) => {
            const { valueInputConfig } = updatedConditions[inputValueAndIndex][inputValueOrIndex];
            const result = operation(data[columnName])(valueInputConfig.value);

            return result;
          },
        );
      });
    });

    onResponseUpdate(updatedResponse);
  };

  const handleRemoveConditionRowClick = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ) => {
    setConditions((oldConditions) => {
      const updatedOrConditions = oldConditions[andIndex].filter((_, index) => index !== orIndex);

      return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
    });
  };

  const handleAndButtonClick = () => {
    if (!defaultCondition) return;

    setConditions((oldConditions) => oldConditions.concat([[defaultCondition]]));
  };

  const checkInputValueValidity = (orCondition: ConditionRow) => {
    const isValueInputNumber = isNumberString(orCondition.valueInputConfig.value);

    return !isValueInputNumber && onlyNumberOperators.includes(orCondition.operatorConfig.value);
  };

  const handleFormInputChange = (
    inputConfigName: InputConfigName,
    value: string,
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ) => {
    const updatedOrConditions = (conditions[andConditionIndexToUpdate] as Array<ConditionRow>).map(
      (condition, index) => {
        return orConditionIndexToUpdate === index
          ? { ...condition, [inputConfigName]: { ...condition[inputConfigName], value } }
          : condition;
      },
    );
    const updatedConditions = arrayReplaceAt<Array<ConditionRowOrIsLoading>>(
      conditions,
      updatedOrConditions,
      andConditionIndexToUpdate,
    );

    setConditions(updatedConditions);

    if (shouldFilterResponse(updatedOrConditions, orConditionIndexToUpdate)) {
      const updatedConditionsOperations = addCompleteConditionsOperations(
        andConditionIndexToUpdate,
        orConditionIndexToUpdate,
      );
      filterResponse(updatedConditionsOperations, updatedConditions as Array<Array<ConditionRow>>);
    }
  };
  return (
    <Box>
      {conditions.map((orConditions, andIndex) => {
        return (
          <React.Fragment key={`orConditionGroup-${andIndex}`}>
            {andIndex > 0 ? <AndSeparator /> : null}
            <Paper elevation={1} sx={{ padding: '1.5rem' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {orConditions.map((orCondition, orIndex) => {
                  return 'isLoading' in orCondition ? (
                    <FormLoading key={`formLoading-${andIndex}-${orIndex}`} />
                  ) : (
                    <FormRow
                      key={`${orCondition.operatorConfig.value}-${orIndex}`}
                      addConditionConfig={addConditionConfig(andIndex, orIndex)}
                      hasOrPrefix={orIndex > 0}
                      hasValueInputError={checkInputValueValidity(orCondition)}
                      leftConditionConfig={{
                        ...orCondition.leftConditionConfig,
                        onChange: (inputName, value) =>
                          handleFormInputChange(inputName, value, andIndex, orIndex),
                      }}
                      onRemoveConditionButtonClick={() => {
                        handleRemoveConditionRowClick(andIndex, orIndex);
                      }}
                      operatorConfig={{
                        ...orCondition.operatorConfig,
                        onChange: (inputName, value) =>
                          handleFormInputChange(inputName, value, andIndex, orIndex),
                      }}
                      valueInputConfig={{
                        ...orCondition.valueInputConfig,
                        onChange: (inputName, value) =>
                          handleFormInputChange(inputName, value, andIndex, orIndex),
                      }}
                    />
                  );
                })}
              </Box>
            </Paper>
          </React.Fragment>
        );
      })}
      <AndButton onAndButtonClick={handleAndButtonClick} />
    </Box>
  );
}

function AndSeparator() {
  return (
    <Box width={80}>
      <Paper
        elevation={1}
        sx={{
          border: '1px solid rgb(225, 229, 233)',
          height: '30px',
          margin: '0px auto',
          width: '1px',
        }}
      />
      <Typography textAlign="center" color="GrayText" component="h6" fontWeight={700} variant="h6">
        {texts.capsAnd}
      </Typography>
      <Paper
        elevation={1}
        sx={{
          border: '1px solid rgb(225, 229, 233)',
          height: '30px',
          margin: '0px auto',
          width: '1px',
        }}
      />
    </Box>
  );
}

interface AndButtonProps {
  onAndButtonClick: () => void;
}

function AndButton({ onAndButtonClick }: AndButtonProps) {
  return (
    <Box width={80}>
      <Paper
        elevation={1}
        sx={{
          border: '1px solid rgb(225, 229, 233)',
          height: '30px',
          margin: '0px auto',
          width: '1px',
        }}
      />
      <Button
        sx={{ alignItems: 'flex-start' }}
        color="primary"
        fullWidth
        onClick={onAndButtonClick}
        size="large"
        startIcon={<AddIcon />}
        variant="outlined"
      >
        {texts.and}
      </Button>
    </Box>
  );
}
