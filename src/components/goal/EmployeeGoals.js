import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { GetManagerName } from "../../service/api/emsService/EmployeeLeaveService";
import {
  searchGoals,
  setUpGoals,
} from "../../service/api/emsService/GoalService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeGoals = () => {
  const { empBasicDetailId } = useParams();
  const { employeeData } = useContext(EmployeeDataContext);
  const navigate = useNavigate();

  const effectiveEmpId =
    empBasicDetailId || employeeData?.employeeBasicDetailId;

  const [managerName, setManagerName] = useState("");
  const [managerId, setManagerId] = useState(0);
  const [goals, setGoals] = useState([]);
  const [addedGoals, setAddedGoals] = useState([]);
  const [goalStatus, setGoalStatus] = useState("");
  const [goalsFetchFailed, setGoalsFetchFailed] = useState(false);
  const [dialogRemarks, setDialogRemarks] = useState("");

  const [employeeDetailsFromGoals, setEmployeeDetailsFromGoals] = useState({
    employeeCode: "",
    fullName: "",
    emailId: "",
  });

  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const fetchManagerName = useCallback(async () => {
    try {
      if (!effectiveEmpId) return;
      const response = await GetManagerName(effectiveEmpId, "leave", {
        additionalInfo: "fetching for goals screen",
      });
      setManagerName(response?.approverName || "N/A");
      setManagerId(response?.approverId || 0);
    } catch (error) {
      console.error("Error fetching manager name:", error);
      setManagerName("N/A");
    }
  }, [effectiveEmpId]);

  const fetchGoalsFromAPI = useCallback(async () => {
    try {
      const payload = {
        empBasicDetailId: effectiveEmpId,
        page: 0,
        size: 10,
      };
      const response = await searchGoals(payload);
      if (!response?.content?.length) {
        setGoalsFetchFailed(true);
        return;
      }

      const setup = response.content[0];
      setGoalStatus(setup.status);
      if (setup.status === "130") {
        setRemarks(setup.comments || "");
      }

      setEmployeeDetailsFromGoals({
        employeeCode: setup.employeeCode || "",
        fullName: setup.fullName || "",
        emailId: setup.emailId || "",
      });
      if (Array.isArray(setup.goalCommentsEntities)) {
        const combinedRemarks = setup.goalCommentsEntities
          .filter((comment) => !!comment.comments?.trim())
          .map((comment) => `${comment.empName}: ${comment.comments}`)
          .join("\n\n");
        setRemarks(combinedRemarks);
      }
      const formattedGoals = [];
      response.content.forEach((setup) => {
        setGoalStatus(setup.status);
        setup.empGoalDetailsEntity?.forEach((detail) => {
          formattedGoals.push({
            goal: detail.goal,
            empGoalSetupId: detail.empGoalSetupId,
            empGoalDetailsId: detail.empGoalDetailsId,
            fromDate: dayjs(detail.fromDate).isValid()
              ? dayjs(detail.fromDate)
              : null,
            toDate: dayjs(detail.toDate).isValid()
              ? dayjs(detail.toDate)
              : null,
            percentage: detail.percentage != null ? detail.percentage : 5,
            goalDescription: detail.goalDescription || "",
            managerConsent: detail.managerComments,
            managerComments: detail.managerComments || "",
            editable: true,
          });
        });
      });
      setGoals(formattedGoals);
      setGoalsFetchFailed(false);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      setGoalsFetchFailed(true);
    }
  }, [effectiveEmpId]);

  useEffect(() => {
    const statusStr = String(goalStatus);
    if ((statusStr === "127" || statusStr === "130") && !empBasicDetailId) {
      setOpenDialog(true);
    }
    fetchManagerName();
    fetchGoalsFromAPI();
  }, [goalStatus, fetchManagerName, fetchGoalsFromAPI, empBasicDetailId]);

  const handleConfirmManagerAction = () => {
    setOpenDialog(false);
    navigate("/home");
  };

  const confirmDeleteRow = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteRow = () => {
    if (deleteIndex < goals.length) {
      const updatedGoals = [...goals];
      updatedGoals.splice(deleteIndex, 1);
      setGoals(updatedGoals);
    } else {
      const newIdx = deleteIndex - goals.length;
      const updatedAddedGoals = [...addedGoals];
      updatedAddedGoals.splice(newIdx, 1);
      setAddedGoals(updatedAddedGoals);
    }
    setDeleteIndex(null);
    setDeleteConfirmOpen(false);
  };

  const handleAddGoalRow = useCallback(() => {
    setTimeout(() => {
      const defaultFromDate =
        goals[0]?.fromDate && dayjs(goals[0].fromDate).isValid()
          ? goals[0].fromDate
          : dayjs();

      const defaultToDate =
        goals[0]?.toDate && dayjs(goals[0].toDate).isValid()
          ? goals[0].toDate
          : dayjs().add(1, "year");

      setAddedGoals((prev) => [
        ...prev,
        {
          goal: "",
          percentage: 5,
          goalDescription: "",
          managerConsent: null,
          managerComments: "",
          editable: true,
          fromDate: defaultFromDate,
          toDate: defaultToDate,
        },
      ]);
    }, 0);
  }, [goals]);

  const updateGoalField = (index, field, value) => {
    const all = [...goals, ...addedGoals];
    const updated = [...all];
    updated[index][field] = value;
    if (index < goals.length) {
      setGoals(updated.slice(0, goals.length));
    } else {
      setAddedGoals(updated.slice(goals.length));
    }
  };

  const handleOpenDialog = (index, _, action) => {
    setSelectedRowIndex(index);
    setSelectedAction(action);
    const all = [...goals, ...addedGoals];
    const target = all[index];
    setDialogRemarks("");
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    const all = [...goals, ...addedGoals];
    const target = all[selectedRowIndex];
    target.managerComments = remarks;
    target.managerConsent = selectedAction;

    const nextStatus =
      selectedAction === "Approved"
        ? "129"
        : selectedAction === "Submit"
        ? "128" // or retain "130" based on your cycle
        : "130";

    const goalSetUpDetails = all.map((goal, idx) => {
      const goalFromAPI = goals[idx];
      return {
        empGoalDetailId: goalFromAPI ? goalFromAPI.empGoalDetailsId : 0,
        goalSetUpId: goalFromAPI ? goalFromAPI.empGoalSetupId : 0,
        goal: goal.goal,
        goalType: "Basic",
        goalDescription: goal.goalDescription || "",
        percentage: goal.percentage,
        comments: goal.managerComments || "",
        status: nextStatus,
        managerComments: goal.managerComments || "",
        managerConsent: goal.managerConsent,
        createdBy: employeeData?.emailId,
      };
    });

    const payload = {
      empGoalSetupId: goals[0]?.empGoalSetupId || 0,
      approvedBy: 0,
      approvedDate: dayjs().format("YYYY-MM-DD"),
      approverComments: "",
      approverId: managerId,
      comments: dialogRemarks,
      emplBasicId: effectiveEmpId,
      status: nextStatus,
      submittedDate: dayjs().format("YYYY-MM-DD"),
      createdBy: employeeData?.emailId,
      goalSetUpDetails,
    };

    try {
      await setUpGoals(payload);
      toast.success(`Goals ${selectedAction.toLowerCase()} successfully!`);
      setOpenDialog(false);
      navigate("/home");
    } catch (error) {
      toast.error(
        `Error while trying to ${selectedAction.toLowerCase()} goals`
      );
    }
  };

  const isGoalDisabled = (field, index) => {
    const isNewRow = index >= goals.length;
    if (isNewRow) return false;
    if (["127", "130"].includes(goalStatus)) {
      return !["Weightage"].includes(field) ? true : false;
    }
    if (goalStatus === "127") {
      return ["goal", "Weightage", "goalDescription"].includes(field);
    } else if (["128", "130"].includes(goalStatus)) {
      return ["goal", "Weightage", "goalDescription"].includes(field);
    } else if (goalStatus === "129") {
      return [
        "goal",
        "Weightage",
        "managerConsent",
        "managerComments",
        "goalDescription",
      ].includes(field);
    } else if (goalStatus === "131") {
      return true;
    }
    return false;
  };

  const getPayloadStatus = () => {
    if (goalStatus === "127") return "128";
    if (goalStatus === "128") return "129";
    if (goalStatus === "129") return "130";
    if (goalStatus === "130") return "128";
    return goalStatus;
  };

  const handleSaveGoals = async () => {
    const allGoals = [...goals, ...addedGoals];
    const goalSetUpDetails = allGoals.map((goal, idx) => {
      const goalFromAPI = goals[idx];
      return {
        empGoalDetailId: goalFromAPI ? goalFromAPI.empGoalDetailsId : 0,
        goalSetUpId: goalFromAPI ? goalFromAPI.empGoalSetupId : 0,
        goal: goal.goal,
        goalType: "Basic",
        goalDescription: goal.goalDescription || "",
        percentage: goal.percentage,
        comments: goal.managerComments || "",
        status: getPayloadStatus(),
        managerComments: goal.managerComments || "",
        managerConsent: goal.managerConsent,
        createdBy: employeeData?.emailId,
        fromDate: goal.fromDate
          ? dayjs(goal.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: goal.toDate ? dayjs(goal.toDate).format("YYYY-MM-DD") : null,
      };
    });

    const payload = {
      empGoalSetupId: goals[0]?.empGoalSetupId || 0,
      approvedBy: 0,
      approvedDate: dayjs().format("YYYY-MM-DD"),
      approverComments: "",
      approverId: managerId,
      comments: remarks,
      emplBasicId: effectiveEmpId,
      status: getPayloadStatus(),
      submittedDate: dayjs().format("YYYY-MM-DD"),
      createdBy: employeeData?.emailId,
      goalSetUpDetails,
    };

    try {
      await setUpGoals(payload);
      toast.success("Goals saved successfully!");
      navigate("/home");
    } catch (error) {
      toast.error("Error saving goals. Please try again.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Employee Goals Overview
        </Typography>

        <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            {["Employee Code", "Employee Name", "Email", "Manager Name"].map(
              (label, idx) => (
                <Grid item xs={12} sm={6} md={3} key={label}>
                  <TextField
                    label={label}
                    fullWidth
                    disabled
                    value={
                      [
                        employeeDetailsFromGoals.employeeCode,
                        employeeDetailsFromGoals.fullName,
                        employeeDetailsFromGoals.emailId,
                        managerName,
                      ][idx]
                    }
                  />
                </Grid>
              )
            )}
          </Grid>
        </Paper>

        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Goal Category",
                    "Goal Description",
                    "Weightage",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{ fontWeight: "bold" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...goals, ...addedGoals].map((goal, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="center">
                      <TextField
                        value={goal.goal}
                        size="small"
                        disabled={!goal.editable || isGoalDisabled("goal", idx)}
                        onChange={(e) =>
                          updateGoalField(idx, "goal", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={goal.goalDescription || ""} arrow>
                        <TextField
                          value={goal.goalDescription || ""}
                          size="small"
                          multiline
                          maxRows={3}
                          onChange={(e) =>
                            updateGoalField(
                              idx,
                              "goalDescription",
                              e.target.value
                            )
                          }
                          disabled={
                            !goal.editable ||
                            isGoalDisabled("goalDescription", idx)
                          }
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={goal.percentage}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsed = Number(value);
                          if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
                            updateGoalField(idx, "percentage", parsed);
                          }
                        }}
                        size="small"
                        inputProps={{
                          min: 0,
                          max: 5,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: { MozAppearance: "textfield" },
                        }}
                        disabled={
                          !goal.editable || isGoalDisabled("Weightage", idx)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      {goal.editable &&
                        (goalStatus === "127" || goalStatus === "130") && (
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                onClick={() => confirmDeleteRow(idx)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {(goalStatus === "130" || goalStatus === "128") && (
          <Grid container justifyContent="center" mt={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Employee's Comments"
                value={remarks}
                multiline
                fullWidth
                rows={4}
                disabled
              />
            </Grid>
          </Grid>
        )}

        {!goalsFetchFailed && (goals.length > 0 || addedGoals.length > 0) && (
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              onClick={handleAddGoalRow}
              disabled={goalStatus !== "127"}
            >
              + Add Goal
            </Button>

            {goalStatus === "127" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveGoals}
              >
                Send to Employee
              </Button>
            ) : goalStatus === "128" ? (
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleOpenDialog(0, null, "Rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleOpenDialog(0, null, "Approved")}
                >
                  Accept
                </Button>
              </Box>
            ) : goalStatus === "129" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveGoals}
              >
                Accept
              </Button>
            ) : goalStatus === "130" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog(0, null, "Submit")}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveGoals}
              >
                Submit
              </Button>
            )}
          </Box>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          {selectedAction ? (
            <>
              <DialogTitle>Confirm {selectedAction}</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Remarks"
                  value={dialogRemarks}
                  onChange={(e) => setDialogRemarks(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button
                  onClick={handleConfirmAction}
                  variant="contained"
                  color={
                    selectedAction === "Approved"
                      ? "success"
                      : selectedAction === "Rejected"
                      ? "error"
                      : "primary"
                  }
                  disabled={!dialogRemarks.trim()}
                >
                  {selectedAction === "Submit" ? "Submit" : "Confirm"}
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <DialogTitle>
                Manager needs to provide the goals. Please contact your manager.
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleConfirmManagerAction}>OK</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Are you sure you want to delete this goal?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteRow} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeGoals;
