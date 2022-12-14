import {
  AddConditionConfig,
  ComparisonOperator,
  DataGridLoading,
  FormLoading,
  FormRow,
  InputConfigName,
  LeftInputConditionConfig,
  OperatorInputConfig,
  ValueInputConfig,
} from '@features/conditionBuilder';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Chip, Container, Paper, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useUrlInputEndpointRequest } from '@services';
import { arrayInsertAt, arrayReplaceAt } from '@utils';
import { useEffect, useState } from 'react';

const texts = {
  and: 'And',
  filtered: 'Filtered',
  requestErrorMessage: 'Unable to fetch data',
  result: 'Result',
  title: 'Condition Builder',
  total: 'Total',
  url: 'Url',
  urlInputDescription:
    'Insert data url. Returning data MUST be an array json with each element is key/value pair.',
};

type AndConditionIndexToUpdate = number;
type OrConditionIndexToUpdate = number;
type ConditionsRow =
  | {
      leftConditionConfig: Omit<LeftInputConditionConfig, 'onChange'>;
      operatorConfig: Omit<OperatorInputConfig, 'onChange'>;
      valueInputConfig: Omit<ValueInputConfig, 'onChange'>;
    }
  | { isLoading: true };

export function ConditionBuilder() {
  const [urlInput, setUrlInput] = useState<string>('https://data.nasa.gov/resource/y77d-th95.json');
  const { hasError, isLoading, response } = useUrlInputEndpointRequest({ endpoint: urlInput });
  const [filteredResponse, setFilteredResponse] = useState<Array<unknown>>([]);
  const [defaultConditions, setDefaultConditions] = useState<Array<ConditionsRow>>([]);
  const [conditions, setConditions] = useState<Array<Array<ConditionsRow>>>([]);

  const addConditionConfig = (
    andIndex: AndConditionIndexToUpdate,
    orIndex: OrConditionIndexToUpdate,
  ): AddConditionConfig => {
    return {
      onClick: () => {
        setConditions((oldConditions) => {
          const updatedOrConditions = arrayInsertAt<ConditionsRow>(
            oldConditions[andIndex],
            defaultConditions[0],
            orIndex + 1,
          )
            // Remove isLoading elements
            .filter((condition) => !('isLoading' in condition));

          return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
        });
      },
      onHover: () => {
        // setConditionWithLoadingBelowIndex([andIndex, orIndex]);
        const orConditionToInsertIndex = orIndex + 1;

        setConditions((oldConditions) => {
          const updatedOrConditions = arrayInsertAt<ConditionsRow>(
            oldConditions[andIndex],
            { isLoading: true },
            orConditionToInsertIndex,
          );

          return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
        });
      },
      onBlur: () => {
        // setConditionWithLoadingBelowIndex(([oldAndConditionIndex]) => [oldAndConditionIndex, null]);
        setConditions((oldConditions) => {
          const updatedOrConditions = oldConditions[andIndex].filter(
            (oldCondition) => !('isLoading' in oldCondition),
          );

          return arrayReplaceAt(oldConditions, updatedOrConditions, andIndex);
        });
      },
    };
  };

  const columns: Array<GridColDef> =
    response[0] &&
    Object.keys(response[0]).map((responseKey) => {
      return {
        field: responseKey,
        flex: 1,
        headerName: responseKey,
      };
    });

  const shouldFilterResponse = (updatedConditions: Array<ConditionsRow>, indexToCheck: number) => {
    const conditionsToUpdate = updatedConditions[indexToCheck];

    if ('isLoading' in conditionsToUpdate) return;

    const { leftConditionConfig, operatorConfig, valueInputConfig } = conditionsToUpdate;

    return leftConditionConfig.value && operatorConfig.value && valueInputConfig.value !== '';
  };

  const handleFormInputChange = (
    inputConfigName: InputConfigName,
    value: string,
    andConditionIndexToUpdate: AndConditionIndexToUpdate,
    orConditionIndexToUpdate: OrConditionIndexToUpdate,
  ) => {
    const updatedOrConditions = conditions[andConditionIndexToUpdate].map((condition, index) => {
      return orConditionIndexToUpdate === index && !('isLoading' in condition)
        ? { ...condition, [inputConfigName]: { ...condition[inputConfigName], value } }
        : condition;
    });

    setConditions((oldConditions) => {
      return arrayReplaceAt<Array<ConditionsRow>>(
        oldConditions,
        updatedOrConditions,
        andConditionIndexToUpdate,
      );
    });

    if (shouldFilterResponse(updatedOrConditions, orConditionIndexToUpdate)) console.log('hola');
  };

  useEffect(
    function startConditions() {
      if (!isLoading && response.length) {
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
        setDefaultConditions([defaultConditionsConfig]);
      }
    },
    [isLoading, response],
  );

  return (
    <Container maxWidth="lg" sx={{ my: '1rem' }}>
      <Typography variant="h3" component="h1" fontWeight={700}>
        {texts.title}
      </Typography>
      <TextField
        sx={{ my: '2rem' }}
        fullWidth
        id="url-helperText"
        error={hasError}
        label={texts.url}
        onChange={(event) => setUrlInput(event.target.value)}
        value={urlInput}
        helperText={hasError ? texts.requestErrorMessage : texts.urlInputDescription}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {isLoading ? (
          <FormLoading />
        ) : (
          <Box>
            <Paper elevation={1} sx={{ padding: '1.5rem' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {conditions.map((andCondition, andIndex) => {
                  return andCondition.map((orCondition, orIndex) => {
                    return 'isLoading' in orCondition ? (
                      <FormLoading key={`formLoading-${andIndex}-${orIndex}`} />
                    ) : (
                      <FormRow
                        key={`${orCondition.operatorConfig.value}-${orIndex}`}
                        addConditionConfig={addConditionConfig(andIndex, orIndex)}
                        hasOrPrefix={orIndex > 0}
                        leftConditionConfig={{
                          ...orCondition.leftConditionConfig,
                          onChange: (inputName, value) =>
                            handleFormInputChange(inputName, value, andIndex, orIndex),
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
                  });
                })}
              </Box>
            </Paper>
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
                color="primary"
                fullWidth
                size="large"
                startIcon={<AddIcon />}
                variant="outlined"
              >
                {texts.and}
              </Button>
            </Box>
          </Box>
        )}
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Typography variant="h5" component="h2" fontWeight={700}>
            {texts.result}
          </Typography>
          {isLoading ? (
            <DataGridLoading />
          ) : (
            <>
              <Box display="flex" gap="1rem">
                <Chip label={`${texts.total}: ${response.length}`} />
                <Chip
                  color="primary"
                  label={`${texts.filtered}: ${filteredResponse.length}`}
                  variant="filled"
                />
              </Box>
              <Box sx={{ height: 430, width: '100%' }}>
                <DataGrid
                  columns={columns}
                  pageSize={100}
                  rows={response}
                  rowsPerPageOptions={[25, 50, 100]}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
