import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const ManagerDetailsModal = ({ open, onClose, tableData, workType }) => {
  const [formattedData, setFormattedData] = useState({ content: [] });

  useEffect(() => {
    // Set headers if necessary, but here we are directly formatting data
    // setHeaders(["Module Name", "Manager Name"]);
  }, []);

  const contentConfig = useCallback((input) => {
    return {
      content: input.map((detail) => [
        {
          isPrint: true,
          value: detail.moduleName,
        },
        {
          isPrint: true,
          value: detail.approverName,
        },
      ]),
    };
  }, []);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      let filteredData;

      if (workType !== "permanent") {
        // Filter to only include the Timesheet module if workType is not permanent
        filteredData = tableData.filter(
          (item) => item.moduleName === "Timesheet"
        );
      } else {
        // Show all modules if workType is permanent
        filteredData = tableData;
      }

      setFormattedData(contentConfig(filteredData));
    }
  }, [tableData, workType, contentConfig]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h6" component="h2">
          Manager Details
        </Typography>
        <Table>
          {/* <TableHead>
            <TableRow>
              <TableCell>Module Name</TableCell>
              <TableCell>Approver Name</TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            {formattedData.content.length > 0 ? (
              formattedData.content.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row[0].value}</TableCell>
                  <TableCell>{row[1].value}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default ManagerDetailsModal;
