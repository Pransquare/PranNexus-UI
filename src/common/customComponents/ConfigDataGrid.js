import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

function ConfigDataGrid({ data, headers, editable, onRowSelectionChange }) {
  const handleRowSelection = (selectionModel) => {
    // Retrieve all selected row IDs from selectionModel
    const selectedRowIds = selectionModel;

    // Find all selected rows data from the rows
    const selectedRows = data.filter((row) => selectedRowIds.includes(row.employeeBasicDetailId));

    if (onRowSelectionChange) {
      onRowSelectionChange(selectedRows); // Pass the array of selected rows
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={headers}
        pageSize={8}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        disableSelectionOnClick
        editMode={editable ? 'row' : 'false'}
        onSelectionModelChange={handleRowSelection} // Handle selection changes
        getRowId={(row) => row.employeeBasicDetailId} // Use employeeId as the row ID
      />
    </div>
  );
}

export default ConfigDataGrid;