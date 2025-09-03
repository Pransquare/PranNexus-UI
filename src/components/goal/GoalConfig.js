import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Toaster } from "../../common/alertComponets/Toaster";
import {
  CreateOrUpdateGoal,
  GetAllGoals,
} from "../../service/api/emsService/GoalService";
import { panelStyle } from "../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const defaultFormData = {
  goalId: null,
  goal: "",
  goalType: "Basic",
  goalDescription: "",
  status: "Active",
};

const defaultErrors = {
  goal: "",
  goalType: "",
  goalDescription: "",
};

const GoalConfig = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { employeeData } = useContext(EmployeeDataContext);

  const validate = () => {
    const tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.goal.trim()) {
      tempErrors.goal = "Goal Categories is required.";
      isValid = false;
    }
    if (!formData.goalType.trim()) {
      tempErrors.goalType = "Goal Type is required.";
      isValid = false;
    }
    if (!formData.goalDescription.trim()) {
      tempErrors.goalDescription = "Goal Description is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGoalAction = async (actionType, goalItem = formData) => {
    const isDelete = actionType === "delete";
    const isEdit = actionType === "edit";

    const goalId = goalItem.goalId;

    if (!goalId && (isEdit || isDelete)) {
      Toaster("error", "Goal ID is missing for this operation.");
      return;
    }

    const payload = {
      id: goalId || 0,
      goal: goalItem.goal || "",
      goalType: goalItem.goalType || "Basic",
      goalDescription: goalItem.goalDescription || "",
      status: isDelete ? "deleted" : goalItem.status || "Active",
    };

    if (!isDelete && !validate()) {
      Toaster("error", "Please fill all mandatory fields.");
      return;
    }

    CreateOrUpdateGoal(payload)
      .then(() => {
        Toaster(
          "success",
          isDelete
            ? "Goal deleted successfully."
            : isEdit
            ? "Goal updated successfully."
            : "Goal saved successfully."
        );
        getAllGoals();
        resetForm();
      })
      .catch(() =>
        Toaster(
          "error",
          isDelete
            ? "Failed to delete goal."
            : isEdit
            ? "Failed to update goal."
            : "Failed to save goal."
        )
      );
  };

  const getAllGoals = useCallback(() => {
    const searchPayload = {
      page: 0,
      size: 100,
      sortBy: "goal",
      order: "asc",
      goal: searchText,
    };
    GetAllGoals(searchPayload)
      .then((res) => {
        const goals =
          res.goals
            ?.filter((goal) => goal.status !== "deleted")
            .map((goal) => ({
              ...goal,
              goalId: goal.id,
            })) || [];
        setData(goals);
      })
      .catch(() => Toaster("error", "Failed to fetch goals."));
  }, [searchText]);

  const viewData = (item) => {
    setFormData(item);
    setDisableForm(true);
  };

  const actionClick = (action, item) => {
    switch (action) {
      case "edit":
        setErrors(defaultErrors);
        setDisableForm(false);
        setFormData({ ...item, goalId: item.goalId }); // Make sure goalId is preserved
        break;
      case "delete":
        handleGoalAction("delete", item);
        break;
      case "view":
        viewData(item);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getAllGoals();
  }, [getAllGoals]);

  return (
    <Box sx={{ ...panelStyle, padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {formData.goalId ? "Edit Goal" : "Add New Goal"}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Goal Categories"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            error={Boolean(errors.goal)}
            helperText={errors.goal}
            required
            disabled={disableForm}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            select
            label="Goal Type"
            name="goalType"
            value={formData.goalType}
            onChange={handleChange}
            error={Boolean(errors.goalType)}
            helperText={errors.goalType}
            required
            disabled={disableForm}
          >
            <MenuItem value="Basic">Basic</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Goal Description"
            name="goalDescription"
            value={formData.goalDescription}
            onChange={handleChange}
            error={Boolean(errors.goalDescription)}
            helperText={errors.goalDescription}
            required
            disabled={disableForm}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={disableForm}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleGoalAction(formData.goalId ? "edit" : "save")}
          disabled={disableForm}
        >
          {formData.goalId ? "Update Goal" : "Save Goal"}
        </Button>
        {formData.goalId && (
          <Button variant="contained" color="error" onClick={resetForm}>
            Cancel Edit
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Goal Categories</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Goal Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.goalId}>
                <TableCell>{row.goal}</TableCell>
                <TableCell>{row.goalType}</TableCell>
                <TableCell>{row.goalDescription}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => actionClick("edit", row)}
                    size="small"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => actionClick("delete", row)}
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GoalConfig;
