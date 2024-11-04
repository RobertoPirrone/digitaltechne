/** @module MostComponents */
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState, useMemo, useEffect, useCallback } from "react";

/**
 * Wrapper intorno a x-data-grid, con qualche default
 *
 * @function
 * @param {GridRowsProp} rows
 * @param {GridColDefs} columns
 * @return {JSX.Element} data grid code
 */
export const MostDataGrid = ({ columns, rows, showToolBar = false, hideFooter = false }) => {
    const [pageSize, setPageSize] = useState(5);
    let slots = {};
    if (showToolBar) slots = { toolbar: GridToolbar };

    return (
        <div style={{ display: "flex", height: "100%" }}>
            <DataGrid hideFooter={hideFooter} autoHeight rowHeight={100} columns={columns} rows={rows} disableSelectionOnClick pageSize={pageSize} onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} pageSizeOptions={[5, 10, 100]} pagination slots={slots} />
        </div>
    );
};
