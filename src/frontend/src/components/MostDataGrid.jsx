import React, { useState, useMemo, useEffect, useCallback } from "react";
import { DataGrid } from '@mui/x-data-grid';

export const MostDataGrid = ({ 
  columns,
  rows
  }) => {
  const [pageSize, setPageSize] = useState(5); 

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <DataGrid autoHeight rowHeight={100} columns={columns} rows={rows} 
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 100]}
        pagination
      />
    </div>
  )
}
