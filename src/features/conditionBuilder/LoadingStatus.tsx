import { Box, Paper, Skeleton } from '@mui/material';

export function LoadingStatus() {
  return <FormIsLoading />;
}

function FormIsLoading() {
  return (
    <Paper elevation={1} sx={{ padding: '1.5rem', gap: '2rem' }}>
      <Box display="flex" gap="1rem" sx={{ height: '3.5rem', width: '100%' }}>
        <Skeleton variant="rounded" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rounded" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="circular" height="100%" width={55} />
        <Skeleton variant="circular" height="100%" width={55} />
      </Box>
    </Paper>
  );
}
