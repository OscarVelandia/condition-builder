import { Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useUrlInputEndpointRequest } from '../../services';
import {
  ComparisonOperator,
  ConditionForm,
  LeftInputConditionConfig,
  OperatorInputConfig,
  ValueInputConfig,
} from './ConditionForm';

const comparisonOperations = {
  [ComparisonOperator.Contain]: (a: string, b: string) => a.includes(b),
  [ComparisonOperator.Equals]: (a: unknown, b: unknown) => a === b,
  [ComparisonOperator.GreaterThan]: (a: number, b: number) => a > b,
  [ComparisonOperator.LessThan]: (a: number, b: number) => a < b,
  [ComparisonOperator.NotContain]: (a: string, b: string) => !a.includes(b),
  [ComparisonOperator.Regex]: (a: string, regex: string) => new RegExp(`${regex}`).test(a),
};

const texts = {
  requestErrorMessage: 'Unable to fetch data',
  title: 'Condition Builder',
  url: 'Url',
  urlInputDescription:
    'Insert data url. Returning data MUST be an array json with each element is key/value pair.',
};

export function ConditionBuilder() {
  const [urlInput, setUrlInput] = useState<string>('https://data.nasa.gov/resource/y77d-th95.json');
  const { hasError, isLoading, response } = useUrlInputEndpointRequest({ endpoint: urlInput });
  const leftConditionConfig: LeftInputConditionConfig = {
    onChange: console.log,
    options: response[0] && Object.keys(response[0]),
    value: response[0] && Object.keys(response[0])[0],
  };
  const operatorConfig: OperatorInputConfig = {
    onChange: console.log,
    options: Object.values(ComparisonOperator),
    value: ComparisonOperator.Equals,
  };

  const valueInputConfig: ValueInputConfig = {
    onChange: console.log,
    value: '',
  };

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

      <ConditionForm
        isLoading={isLoading}
        leftConditionConfig={leftConditionConfig}
        operatorConfig={operatorConfig}
        valueInputConfig={valueInputConfig}
      />
    </Container>
  );
}
