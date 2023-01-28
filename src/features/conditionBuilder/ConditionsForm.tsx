import {
  AddConditionConfig,
  FormLoading,
  FormRow,
  InputConfigName,
  LeftInputConditionConfig,
  OperatorInputConfig,
  ValueInputConfig,
} from '@features/conditionBuilder';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { SuccessRequestResponse, SuccessRequestResponsePossibleValues } from '@services';
import {
  arrayInsertAt,
  arrayRemoveItemAt,
  arrayReplaceAt,
  logicalOperations,
  ComparisonOperator,
  isEmpty,
  hasOnlyStringNumbers,
  objectRemoveByKey,
} from '@utils';
import React, { useEffect, useState } from 'react';

const texts = {
  and: 'And',
  capsAnd: 'AND',
};

type AndConditionIndexToUpdate = number;
type OrConditionIndexToUpdate = number;
type CompletedFormConditions = {
  [key: AndConditionIndexToUpdate]: {
    [key: OrConditionIndexToUpdate]: {
      columnName: string;
      inputValueAndIndex: number;
      inputValueOrIndex: number;
      operation: (
        columnValue: SuccessRequestResponsePossibleValues,
      ) => (inputValue: string) => boolean;
    };
  };
};

type IsLoadingCondition = { isLoading: true };
type OrCondition = {
  leftConditionConfig: Omit<LeftInputConditionConfig, 'onChange'>;
  operatorConfig: Omit<OperatorInputConfig, 'onChange'>;
  valueInputConfig: Omit<ValueInputConfig, 'onChange'>;
};
type OrConditionOrIsLoading = OrCondition | IsLoadingCondition;

interface Props {
  onResponseUpdate: (
    updatedResponse: Record<string, SuccessRequestResponsePossibleValues>[],
  ) => void;
  response: SuccessRequestResponse;
}

export function ConditionsForm({ onResponseUpdate, response }: Props) {
  const [defaultOrCondition, setDefaultOrCondition] = useState<OrCondition | null>(null);
  const [conditions, setConditions] = useState<Array<Array<OrConditionOrIsLoading>>>([]);
  const [completedFormConditions, setCompletedFormConditions] = useState<CompletedFormConditions>(
    {},
  );
  const onlyNumberOperators = [ComparisonOperator.GreaterThan, ComparisonOperator.LessThan];

  useEffect(
    function initializeConditions() {
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
      setDefaultOrCondition(defaultConditionsConfig);
    },
    [response],
  );

  const addConditionConfig = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ): AddConditionConfig => {
    return {
      onClick: () => {
        if (!defaultOrCondition) return;

        setConditions((oldConditions) => {
          const updatedOrConditions = arrayInsertAt<OrConditionOrIsLoading>(
            oldConditions[andIndex],
            defaultOrCondition,
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
          const updatedOrConditions = arrayInsertAt<OrConditionOrIsLoading>(
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

  const addCompleteConditionsOperations = (
    allConditions: Array<Array<OrCondition>>,
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ): CompletedFormConditions => {
    const selectedCondition = allConditions[andConditionIndexToUpdate][orConditionIndexToUpdate];
    const operator = selectedCondition.operatorConfig.value;
    const columnName = selectedCondition.leftConditionConfig.value;
    const updatedCompletedFormConditions: CompletedFormConditions = {
      ...completedFormConditions,
      [andConditionIndexToUpdate]: {
        ...completedFormConditions[andConditionIndexToUpdate],
        [orConditionIndexToUpdate]: {
          columnName,
          inputValueAndIndex: andConditionIndexToUpdate,
          inputValueOrIndex: orConditionIndexToUpdate,
          operation: (columnValue) => (inputValue) => {
            if (inputValue === '') {
              return true;
            }

            if (typeof columnValue === 'string') {
              return logicalOperations[operator](columnValue, inputValue);
            }

            return false;
          },
        },
      },
    };

    setCompletedFormConditions(updatedCompletedFormConditions);

    return updatedCompletedFormConditions;
  };

  const removeNotValidCompleteConditions = (
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ) => {
    const updatedOrConditions = objectRemoveByKey<CompletedFormConditions>(
      completedFormConditions[andConditionIndexToUpdate],
      orConditionIndexToUpdate,
    );
    const updatedCompleteFormConditions: CompletedFormConditions = {
      ...completedFormConditions,
      ...(isEmpty(updatedOrConditions) ? {} : { [andConditionIndexToUpdate]: updatedOrConditions }),
    };

    setCompletedFormConditions(updatedCompleteFormConditions);

    return updatedCompleteFormConditions;
  };

  const filterResponse = (
    updatedCompletedFormConditions: CompletedFormConditions,
    updatedConditions: Array<Array<OrCondition>>,
  ) => {
    const andConditions = Object.values(updatedCompletedFormConditions);
    const completeOrConditions = andConditions.map((condition) => Object.values(condition));

    const updatedResponse = response.filter((data) => {
      return completeOrConditions.every((orCondition) => {
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

  const updateConditionsOnRemove = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ) => {
    const updatedOrConditions = conditions[andIndex].filter((_, index) => index !== orIndex);
    const updatedConditions =
      updatedOrConditions.length > 0
        ? arrayReplaceAt(conditions, updatedOrConditions, andIndex)
        : arrayRemoveItemAt(conditions, andIndex);

    setConditions(updatedConditions);

    return updatedConditions;
  };

  const updateCompletedFormConditions = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ) => {
    if (!completedFormConditions[andIndex]?.[orIndex]) return completedFormConditions;

    const updatedOrCompletedFormConditions = objectRemoveByKey(
      completedFormConditions[andIndex],
      orIndex,
    );
    const updatedCompletedFormConditions = isEmpty(updatedOrCompletedFormConditions)
      ? objectRemoveByKey(completedFormConditions, andIndex)
      : {
          ...completedFormConditions,
          [andIndex]: updatedOrCompletedFormConditions,
        };

    setCompletedFormConditions(updatedCompletedFormConditions);

    return updatedCompletedFormConditions;
  };

  const handleRemoveConditionRowClick = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ) => {
    const updatedConditions = updateConditionsOnRemove(andIndex, orIndex);
    const updatedCompletedFormConditions = updateCompletedFormConditions(andIndex, orIndex);

    filterResponse(updatedCompletedFormConditions, updatedConditions as Array<Array<OrCondition>>);
  };

  const handleAndButtonClick = () => {
    if (!defaultOrCondition) return;

    setConditions((oldConditions) => oldConditions.concat([[defaultOrCondition]]));
  };

  const hasInputValueError = (inputValue: string, operator: ComparisonOperator) => {
    const isValueInputNumber = hasOnlyStringNumbers(inputValue);

    return inputValue === ''
      ? false
      : !isValueInputNumber && onlyNumberOperators.includes(operator);
  };

  const isValidOrCondition = (
    updatedConditions: Array<OrCondition>,
    indexToCheck: number,
  ): boolean => {
    const orConditionToUpdate = updatedConditions[indexToCheck];
    const { operatorConfig, valueInputConfig } = orConditionToUpdate;

    return (
      valueInputConfig.value !== '' &&
      !hasInputValueError(valueInputConfig.value, operatorConfig.value)
    );
  };

  const updateConditionsOnInputChange = (
    inputConfigName: InputConfigName,
    value: string,
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ): {
    updatedConditions: Array<Array<OrCondition>>;
    wasOrConditionValid: boolean;
  } => {
    const orCondition = conditions[andConditionIndexToUpdate] as Array<OrCondition>;
    const wasOrConditionValid = isValidOrCondition(orCondition, orConditionIndexToUpdate);
    const updatedOrConditions = orCondition.map((condition, index) => {
      return orConditionIndexToUpdate === index
        ? { ...condition, [inputConfigName]: { ...condition[inputConfigName], value } }
        : condition;
    });
    const updatedConditions = arrayReplaceAt<Array<OrConditionOrIsLoading>>(
      conditions,
      updatedOrConditions,
      andConditionIndexToUpdate,
    ) as Array<Array<OrCondition>>;

    setConditions(updatedConditions);

    return {
      updatedConditions,
      wasOrConditionValid,
    };
  };

  const updateCompleteConditionOperations = (
    updatedConditions: Array<Array<OrCondition>>,
    andConditionIndexToUpdate: number,
    orConditionIndexToUpdate: number,
    wasOrConditionValid: boolean,
  ) => {
    const updatedOrConditions = updatedConditions[andConditionIndexToUpdate];
    const isNotValidAndWasValid =
      !isValidOrCondition(updatedOrConditions, orConditionIndexToUpdate) && wasOrConditionValid;

    if (isValidOrCondition(updatedOrConditions, orConditionIndexToUpdate)) {
      const updatedConditionsOperations = addCompleteConditionsOperations(
        updatedConditions,
        andConditionIndexToUpdate,
        orConditionIndexToUpdate,
      );

      filterResponse(updatedConditionsOperations, updatedConditions);
    } else if (isNotValidAndWasValid) {
      const updatedConditionsOperations = removeNotValidCompleteConditions(
        andConditionIndexToUpdate,
        orConditionIndexToUpdate,
      );

      filterResponse(updatedConditionsOperations, updatedConditions);
    }
  };

  const handleFormInputChange = (
    inputConfigName: InputConfigName,
    value: string,
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ) => {
    const { updatedConditions, wasOrConditionValid } = updateConditionsOnInputChange(
      inputConfigName,
      value,
      andConditionIndexToUpdate,
      orConditionIndexToUpdate,
    );
    updateCompleteConditionOperations(
      updatedConditions,
      andConditionIndexToUpdate,
      orConditionIndexToUpdate,
      wasOrConditionValid,
    );
  };

  return (
    <Box data-testid="condition-form">
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
                      hasValueInputError={hasInputValueError(
                        orCondition.valueInputConfig.value,
                        orCondition.operatorConfig.value,
                      )}
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
                      isDisabledRemoveConditionButton={
                        conditions.length === 1 && conditions[0].length === 1
                      }
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
