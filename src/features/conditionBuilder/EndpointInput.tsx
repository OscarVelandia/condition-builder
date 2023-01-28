import { TextField, Typography } from '@mui/material';

export const EndpointInputTexts = {
  requestErrorMessage: 'Unable to fetch data or Endpoint response is not an Array',
  title: 'Condition Builder',
  url: 'Url',
  urlInputDescription:
    'Insert data url. Returning data MUST be an array json with each element is key/value pair.',
};

interface Props {
  hasError: boolean;
  setUrlInput: (url: string) => void;
  urlInput: string;
}

export function EndpointInput({ hasError, setUrlInput, urlInput }: Props) {
  return (
    <>
      <Typography variant="h3" component="h1" fontWeight={700}>
        {EndpointInputTexts.title}
      </Typography>
      <TextField
        sx={{ my: '2rem' }}
        fullWidth
        id="url-helperText"
        error={hasError}
        label={EndpointInputTexts.url}
        onChange={(event) => setUrlInput(event.target.value)}
        value={urlInput}
        helperText={
          hasError ? EndpointInputTexts.requestErrorMessage : EndpointInputTexts.urlInputDescription
        }
      />
    </>
  );
}
