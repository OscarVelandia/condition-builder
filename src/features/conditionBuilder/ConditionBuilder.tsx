import {
  ConditionsForm,
  DataGridLoading,
  FormLoading,
  ResultDataGrid,
} from '@features/conditionBuilder';
import { Box, Container, TextField, Typography } from '@mui/material';
import {
  SuccessRequestResponse,
  SuccessRequestResponsePossibleValues,
  useUrlInputEndpointRequest,
} from '@services';
import { useEffect, useState } from 'react';

const texts = {
  requestErrorMessage: 'Unable to fetch data or Endpoint response is not an Array',
  result: 'Result',
  title: 'Condition Builder',
  url: 'Url',
  urlInputDescription:
    'Insert data url. Returning data MUST be an array json with each element is key/value pair.',
};

export function ConditionBuilder() {
  const [urlInput, setUrlInput] = useState<string>('https://data.nasa.gov/resource/y77d-th95.json');
  const { hasError, isLoading, isSuccess, response } = useUrlInputEndpointRequest({
    endpoint: urlInput,
  });
  const [filteredResponse, setFilteredResponse] = useState<SuccessRequestResponse>([]);

  useEffect(
    function initializeFilteredResponse() {
      if (isSuccess) {
        setFilteredResponse(response);
      }
    },
    [isLoading, isSuccess, response],
  );

  const handleUpdateFilteredResponse = (
    updatedResponse: Record<string, SuccessRequestResponsePossibleValues>[],
  ) => {
    setFilteredResponse(updatedResponse);
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {isLoading ? (
          <FormLoading />
        ) : (
          <ConditionsForm onResponseUpdate={handleUpdateFilteredResponse} response={response} />
        )}
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Typography variant="h5" component="h2" fontWeight={700}>
            {texts.result}
          </Typography>
          {isLoading ? (
            <DataGridLoading />
          ) : (
            <ResultDataGrid filteredResponse={filteredResponse} response={response} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
