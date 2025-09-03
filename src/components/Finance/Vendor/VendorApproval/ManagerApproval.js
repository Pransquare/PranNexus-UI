import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import {
  SearchVendor,
  ApproveOrRejectVendor,
} from "../../../../service/api/nemsService/VendorService";

const ManagerApproval = () => {
  const [approvals, setApprovals] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApprovalData = useCallback(async () => {
    try {
      const response = await SearchVendor({
        workflowStatuses: ["101"],
        page,
        size: rowsPerPage,
      });
      setApprovals(response?.content || []);
      setTotalCount(response?.totalElements || 0);
    } catch (error) {
      Toaster("error", "Failed to fetch vendor approvals");
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchApprovalData();
  }, [fetchApprovalData]);

  const handleConfirm = async () => {
    if (!selectedVendor || !selectedAction) return;

    setIsSubmitting(true);

    const payload = {
      vendorId: selectedVendor.id,
      managerId: selectedVendor.managerId,
      workflowStatus: selectedAction === "approve" ? "102" : "103",
      remarks,
    };

    try {
      await ApproveOrRejectVendor(payload);
      Toaster(
        "success",
        `Vendor ${selectedVendor.vendorName} ${selectedAction}d successfully.`
      );
      setOpenConfirm(false);
      setRemarks("");
      fetchApprovalData();
    } catch (error) {
      Toaster("error", `Failed to ${selectedAction} vendor.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickAction = (action, vendor) => {
    setSelectedAction(action);
    setSelectedVendor(vendor);
    setRemarks("");
    setOpenConfirm(true);
  };

  const handlePageChange = (_event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 4, maxWidth: "1300px", margin: "auto" }}>
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#f4f6f8" }}>
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Manager Approval Panel
        </Typography>

        <TableContainer sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  "Vendor Name",
                  "Client",
                  "Resource",
                  "Contract Type",
                  "Client Rate",
                  "SSIT Rate",
                  "Rate Margin",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f4f6f8",
                      border: "1px solid #ddd",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {approvals.map((item, idx) => (
                <TableRow key={item.id || idx}>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {item.vendorName}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {item.client}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {item.resource}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {item.contractType}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    ${item.clientRate}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    ${item.ssitRate}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {item.rateMargin?.toFixed(2)}%
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    {item.status?.description || "Pending"}
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                    <Tooltip title="Approve Vendor">
                      <IconButton
                        onClick={() => handleClickAction("approve", item)}
                        sx={{
                          color: "#4caf50",
                          backgroundColor: "#e8f5e9",
                          mr: 1,
                        }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject Vendor">
                      <IconButton
                        onClick={() => handleClickAction("reject", item)}
                        sx={{ color: "#f44336", backgroundColor: "#ffebee" }}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          setRemarks("");
        }}
      >
        <DialogTitle>
          Confirm {selectedAction === "approve" ? "Approval" : "Rejection"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedAction} vendor "
            {selectedVendor?.vendorName}"?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenConfirm(false);
              setRemarks("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={selectedAction === "approve" ? "success" : "error"}
            disabled={!remarks.trim()}
          >
            Yes, {selectedAction}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerApproval;
