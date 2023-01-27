import { Box, Skeleton } from '@mui/material';

export function FormLoading() {
  return (
    <Box
      display="flex"
      gap="1rem"
      sx={{ height: '3.5rem', width: '100%' }}
      data-testid="form-loading"
    >
      <Skeleton variant="rounded" height="100%" sx={{ flex: 1 }} />
      <Skeleton variant="rounded" height="100%" sx={{ flex: 1 }} />
      <Skeleton variant="rounded" height="100%" sx={{ flex: 1 }} />
      <Skeleton variant="circular" height="100%" width={55} />
      <Skeleton variant="circular" height="100%" width={55} />
    </Box>
  );
}
