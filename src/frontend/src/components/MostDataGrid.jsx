/** @module MostComponents */
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useMemo, useEffect, useCallback } from "react";

/**
 * Wrapper intorno a x-data-grid, con qualche default
 *
 * @function
 * @param {GridRowsProp} rows
 * @param {GridColDefs} columns
 * @return {JSX.Element} data grid code
 */
export const MostDataGrid = ({ columns, rows }) => {
    const [pageSize, setPageSize] = useState(5);

    return (
        <div style={{ display: "flex", height: "100%" }}>
            <DataGrid autoHeight rowHeight={100} columns={columns} rows={rows} disableSelectionOnClick pageSize={pageSize} onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} pageSizeOptions={[5, 10, 100]} pagination />
        </div>
    );
};
