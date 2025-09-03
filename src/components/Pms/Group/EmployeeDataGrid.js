import React from 'react';
import ConfigDataGrid from '../../../common/customComponents/ConfigDataGrid'; // Adjust the import path as needed

function EmployeeDataGrid({ employeeData, onRowSelectionChange }) {
  return (
    <ConfigDataGrid
      data={employeeData}
      headers={[
        { field: 'employeeCode', headerName: 'Employee ID', width: 150 },
        { field: 'firstName', headerName: 'First Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'designation', headerName: 'Designation', width: 150 },
        { field: 'emailId', headerName: 'Email', width: 200 },
        // Add more headers as needed
      ]}
      uniqueIdField="employeeBasicDetailId"
      editable={true}
      onRowSelectionChange={onRowSelectionChange}
      sx={{ mt: 2 }}
    />
  );
}

export default EmployeeDataGrid;