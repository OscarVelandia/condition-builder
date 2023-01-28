import { Box, Paper, Skeleton } from '@mui/material';

export function DataGridLoading() {
  return (
    <Paper data-testid="data-grid-loading" elevation={1} sx={{ padding: '1.5rem', gap: '2rem' }}>
      <Box display="flex" gap="1rem" sx={{ height: '3.5rem' }}>
        <Skeleton variant="rounded" height="2rem" width="6rem" />
        <Skeleton variant="rounded" height="2rem" width="6rem" />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="0.5rem"
        sx={{ height: '450px', width: '100%' }}
      >
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
        <Skeleton variant="rectangular" height="100%" sx={{ flex: 1 }} />
      </Box>
    </Paper>
  );
}
