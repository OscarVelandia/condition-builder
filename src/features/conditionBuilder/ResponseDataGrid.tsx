import { Box, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SuccessRequestResponse } from '@services';

const texts = {
  filtered: 'Filtered',
  total: 'Total',
};

interface Props {
  response: SuccessRequestResponse;
  filteredResponse: SuccessRequestResponse;
}

export function ResponseDataGrid({ filteredResponse, response }: Props) {
  const columns: Array<GridColDef> = Object.keys(response[0]).map((responseKey) => {
    return {
      field: responseKey,
      flex: 1,
      headerName: responseKey,
    };
  });

  return (
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
          rows={filteredResponse}
          rowsPerPageOptions={[25, 50, 100]}
        />
      </Box>
    </>
  );
}
