import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { GetAllEmployeeByStatus } from "../../../service/api/nemsService/EmployeeService"; // Import your API method
import ConfigTable from "../../../common/customComponents/ConfigTable";
const EmployeeTable = () => {
  const { status } = useParams(); // status from URL (e.g., 'active', 'inactive')
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = ["S.No", "Employee ID", "Name"];

  useEffect(() => {
    setLoading(true);
  
    // Define the statusCode based on the current status
    const statusCode = status === 'active' ? 108 : 117;
  
    // Pass statusCode as a query parameter using 'params'
    GetAllEmployeeByStatus(statusCode)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to load employees:", err);
      })
      .finally(() => setLoading(false));
  }, [status]);
  
  

  const contentConfig = useCallback(
    (input) => ({
      content: input.map((employee, index) => [
        {
          isPrint: true,
          forAction: false,
          value: index + 1, // 🔢 Serial number (starts from 1)
        },
        {
          isPrint: true,
          forAction: false,
          value: employee.employeeCode, // 🆔 Employee ID
        },
        {
          isPrint: true,
          forAction: false,
          value: `${employee.firstName} ${employee.lastName}`, // 🧑 Full name
        },
      ]),
    }),
    []
  );

  const alignment = ['center', 'left', 'left'];

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {status?.charAt(0).toUpperCase() + status?.slice(1)} Employees
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <ConfigTable
          data={contentConfig(data)}
          headers={headers}
          actions={null} // or remove if not using actions
          alignment={alignment}
        />
      )}
    </Box>
  );
};

export default EmployeeTable;
