import React, { useState, useCallback } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

const PolicyTable = () => {
  // Example policy data (replace with actual data if needed)
  const policies = [
    { policyName: "Rewards & Recognition", policyId: 1 },
    { policyName: "Health & Safety", policyId: 2 },
    { policyName: "Grievance Policy", policyId: 3 },
    { policyName: "Dress Code", policyId: 4 },
    { policyName: "Disciplinary Code", policyId: 5 },
    { policyName: "Contract or Temporary", policyId: 6 },
    { policyName: "Certificate", policyId: 7 },
    { policyName: "PoSh Policy", policyId: 8 },
    { policyName: "pransquarePoSHpolicy", policyId: 9 },
    { policyName: "Immigration Policy", policyId: 10 },
    { policyName: "Exit Policy", policyId: 11 },
    { policyName: "Domestic Travel Policy (India)", policyId: 12 },
    { policyName: "Compliance Policy", policyId: 13 },
    { policyName: "Asset Management", policyId: 14 },
    { policyName: "Office Policy", policyId: 15 },
  ];

  // Table configuration for the policies
  const contentConfig = useCallback((input) => {
    return {
      actions: {
        view: true, // Only view action
      },
      content: input.map((policy) => [
        {
          forAction: false,
          isPrint: true,
          value: policy.policyName, // The policy name
        },
        {
          forAction: true,
          isPrint: false,
          value: { policyName: policy.policyName, policyId: policy.policyId }, // Pass the policy object for action
        },
      ]),
    };
  }, []);

  // State hooks for pagination and modal
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  // Handle page change in table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle view action (to display the policy PDF in the modal)
  const handleView = (policyName, policyId) => {
    setSelectedPolicy({ policyName, policyId });
    setOpenModal(true); // Open modal when the "View" button is clicked
  };

  // Handle close modal action
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPolicy(null); // Reset selected policy when modal is closed
  };

  // Get PDF URL based on policy name (assuming PDF files are in the public/policy folder)
  const getPdfUrl = (policyName) => {
    return `/Policies/${policyName}.pdf`; // Path to PDF in the public folder
  };

  const config = contentConfig(policies); // Get the table configuration

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Policies
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Policy Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {config.content
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row[0].value}</TableCell>
                  <TableCell>
                    <IconButton
                      color="success"
                      onClick={() =>
                        handleView(
                          row[1].value.policyName,
                          row[1].value.policyId
                        )
                      }
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={config.content.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Modal to view the PDF */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Viewing Policy: {selectedPolicy?.policyName}</DialogTitle>
        <DialogContent>
          {/* Use an iframe to display the PDF without controls */}
          <iframe
            src={`${getPdfUrl(selectedPolicy?.policyName)}#toolbar=0`} // Adding `#toolbar=0` removes the toolbar
            width="100%"
            height="500px"
            title="Policy PDF"
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCloseModal} color="primary">
            Close
          </IconButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PolicyTable;
