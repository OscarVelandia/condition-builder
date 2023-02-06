import {
  ConditionsForm,
  DataGridLoading,
  EndpointInput,
  FormLoading,
  ResultDataGrid,
} from '@features/conditionBuilder';
import { Box, Container, Typography } from '@mui/material';
import {
  SuccessRequestResponse,
  SuccessRequestResponsePossibleValues,
  useUrlInputEndpointRequest,
} from '@services';
import { useEffect, useState } from 'react';

export const ConditionBuilderTexts = {
  result: 'Result',
};

const DEFAULT_ENDPOINT = 'https://data.nasa.gov/resource/y77d-th95.json';

export function ConditionBuilder() {
  const [urlInput, setUrlInput] = useState<string>(DEFAULT_ENDPOINT);
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
      <EndpointInput hasError={hasError} setUrlInput={setUrlInput} urlInput={urlInput} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {isLoading ? (
          <FormLoading />
        ) : (
          <ConditionsForm onResponseUpdate={handleUpdateFilteredResponse} response={response} />
        )}
        <Box display="flex" flexDirection="column" gap="0.5rem">
          <Typography variant="h5" component="h2" fontWeight={700}>
            {ConditionBuilderTexts.result}
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
