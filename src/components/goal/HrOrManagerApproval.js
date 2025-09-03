import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  Paper,
  Chip,
} from "@mui/material";
import { Toaster } from "../../common/alertComponets/Toaster";
import { searchGoals } from "../../service/api/emsService/GoalService";
import { useNavigate } from "react-router-dom";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const HrOrManagerApproval = () => {
  const [goalData, setGoalData] = useState([]);
  const navigate = useNavigate();
  const { employeeData } = useContext(EmployeeDataContext);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const payload = {
      approverId: employeeData?.employeeBasicDetailId,
      status: [127, 130],
      page: 0,
      size: 10,
    };

    try {
      const response = await searchGoals(payload);
      setGoalData(response?.content || []);
    } catch (error) {
      Toaster("error", "Error fetching goal data");
    }
  };

  const handleViewClick = (empBasicDetailId) => {
    navigate(`/home/ems/goals/employeeGoals/${empBasicDetailId}`);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "127":
        return <Chip label="Goal Initiated" />;
      case "130":
        return <Chip label="Employee Rejected" />;
      default:
        return <Chip label={`Status: ${status}`} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Goals for Approval
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Employee Code</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goalData.map((goal) => (
                <TableRow key={goal.empGoalSetupId}>
                  <TableCell>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewClick(goal.empBasicDetailId);
                      }}
                      color="primary"
                      underline="hover"
                    >
                      {goal.employeeCode}
                    </Link>
                  </TableCell>
                  <TableCell>{goal.fullName}</TableCell>
                  <TableCell>{goal.emailId}</TableCell>
                  <TableCell>{getStatusLabel(goal.status)}</TableCell>
                </TableRow>
              ))}
              {goalData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No goals found for approval.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default HrOrManagerApproval;
