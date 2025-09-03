import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  ChangeEmployeeLeaveStatus,
  FindEmployeeLeaves,
  GetEmployeeLeaveByApproverId,
} from "../../../service/api/emsService/EmployeeLeaveService";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ManagerDashboard from "./ManagerDashboard";

const defaultFormData = {
  leaveType: "",
  statusType: "",
  year: "",
};
export const LeaveApprovals = ({ leaveData }) => {
  const { employeeData } = useContext(EmployeeDataContext);
  const [panel, setPanel] = useState("pendingRequests");
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    GetEmployeeLeaveByApproverId(employeeData?.employeeBasicDetailId)
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const changeEmployeeLeaveStatus = (type, data) => {
    ChangeEmployeeLeaveStatus({
      employeeLeaveId: data.empLeaveId,
      status: type === "approve" ? "102" : "103",
      remarks: type === "reject" ? remarks : null,
    })
      .then(() => {
        Toaster(
          "success",
          type === "approve" ? "Leave is Approved" : "Leave is Rejected"
        );
        GetEmployeeLeaveByApproverId(employeeData?.employeeBasicDetailId)
          .then((data) => {
            setData(data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };
  const handleOpenDialog = (data) => {
    setSelectedLeave(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRemarks("");
    setSelectedLeave(null);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleReject = () => {
    if (remarks.trim() === "") {
      Toaster("error", "Please enter remarks for rejection.");
      return;
    }
    changeEmployeeLeaveStatus("reject", { ...selectedLeave, reason: remarks });
    handleCloseDialog();
  };

  const customButtons = (data) => {
    return (
      <Box variant="contained" aria-label="Basic button group" size="small">
        <Button
          size="small"
          color="warning"
          onClick={() => {
            handleOpenDialog(data);
          }}
        >
          Reject
        </Button>
        <Button
          size="small"
          color="success"
          onClick={() => {
            changeEmployeeLeaveStatus("approve", data);
          }}
        >
          Approve
        </Button>
      </Box>
    );
  };
  const contentConfig = useCallback(
    (input) => {
      return {
        actions: {
          edit: false,
          delete: false,
          view: false,
        },
        content: input.map((content) => {
          return [
            {
              forAction: false,
              isPrint: true,
              value: content?.employeeName,
            },
            {
              forAction: false,
              isPrint: true,
              value: leaveData.find(
                (data) => data.leaveTypeCode === content.leaveType
              )?.leaveTypeDescription,
            },
            {
              forAction: false,
              isPrint: true,
              value: `${content.leaveFrom} - ${content.leaveTo}`,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.noOfDays,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.reason,
            },
            {
              forAction: true,
              isPrint: false,
              value: { ...content },
              customActions: customButtons(content),
            },
          ];
        }),
      };
    },
    [data]
  );
  return (
    <Box component="div">
      <Box display="flex" justifyContent="flex-start" mb={1}>
        <Box mr={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPanel(() => "pendingRequests")}
          >
            Pending Requests
          </Button>
        </Box>
        {/* <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPanel(() => "teamLeaveCalendar")}
          >
            Team Leave Calendar
          </Button>
        </Box> */}
      </Box>
      {panel === "pendingRequests" && (
        <ConfigTable
          data={contentConfig(data)}
          headers={[
            "Employee Name",
            "Leave Type",
            "Leave Range",
            "No. of Days",
            "Description",
            "Action",
          ]}
        />
      )}
      {panel === "teamLeaveCalendar" && <ManagerDashboard />}
      <Box component="div" width="50%">
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Reject Leave Request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter remarks for rejection:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="remarks"
              label="Remarks"
              type="text"
              fullWidth
              size="small"
              value={remarks}
              onChange={handleRemarksChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleReject} color="secondary">
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
