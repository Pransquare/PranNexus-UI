import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Autocomplete,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { SearchSharp } from "@mui/icons-material";
import {
  GetAllByEmpId,
  GetEmployeeByEmployeeCode,
  GetEmployeesByName,
  SaveApproverConfig,
} from "../../../service/api/emsService/EmployeeService";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";

export const approverConfigMasterData = [
  {
    module: "Leave",
    moduleCode: "leave",
    approverCode: "",
    approverName: "",
  },
  {
    module: "Timesheet",
    moduleCode: "timesheet",
    approverCode: "",
    approverName: "",
  },
  {
    module: "Reporting Manager",
    moduleCode: "jobManager",
    approverCode: "",
    approverName: "",
  },
  {
    module: "Appraisal Manager",
    moduleCode: "performance",
    approverCode: "",
    approverName: "",
  },
  {
    module: "HR Process",
    moduleCode: "hrProcess",
    approverCode: "",
    approverName: "",
  },
  {
    module: "Budget Process",
    moduleCode: "budgetProcess",
    approverCode: "",
    approverName: "",
  },
  {
    module: "Management Process",
    moduleCode: "managementProcess",
    approverCode: "",
    approverName: "",
  },
  {
    module: "IT Process",
    moduleCode: "IT",
    approverCode: "",
    approverName: "",
  },
  {
    module: "Vendor Process",
    moduleCode: "vendorProcess",
    approverCode: "",
    approverName: "",
  },
];
const ApprovalConfig = ({ employeeData, decisionClick }) => {
  const userData = useContext(EmployeeDataContext).employeeData;
  const [approvers, setApprovers] = useState(
    [...approverConfigMasterData].map((data) => ({
      userApproverConfigId: "",
      moduleCode: data.moduleCode,
      approverCode: "",
      approverName: "",
      approverData: null,
      searchResults: [],
      module: data.module,
    }))
  );

  const handleApproverCodeChange = (index, value) => {
    const newApprovers = [...approvers];
    GetEmployeeByEmployeeCode(value)
      .then((res) => {
        if (res) {
          newApprovers[index].approverName = `${res.firstName} ${res.lastName}`;
          newApprovers[index].approverCode = res.employeeCode;
          newApprovers[index].approverId = res.employeeBasicDetailId; // ✅ important line
          newApprovers[index].approverData = res;
          setApprovers(newApprovers);
        } else {
          newApprovers[index].approverName = "";
          newApprovers[index].approverData = null;
          newApprovers[index].approverId = null;
          Toaster("error", "Employee not found");
          setApprovers(newApprovers);
          return;
        }
      })
      .catch((err) => {
        newApprovers[index].approverName = "";
        newApprovers[index].approverData = null;
        newApprovers[index].approverId = null;
        Toaster("error", "Employee not found");
        setApprovers(newApprovers);
      });
  };

  const setOptions = useCallback(
    (value, index) => {
      GetEmployeesByName(value)
        .then((data) => {
          const newApprovers = [...approvers];
          newApprovers[index] = {
            ...newApprovers[index],
            approverName: value,
            searchResults: data,
          };
          setApprovers(newApprovers);
        })
        .catch();
    },
    [approvers]
  );

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const newApprovers = [...approvers];
    newApprovers[index] = { ...newApprovers[index], [name]: value };
    setApprovers(newApprovers);
    const employee = newApprovers[index].searchResults?.find(
      (data) => data.fullName === value
    );
    if (employee) {
      newApprovers[index].searchResults = [];
      newApprovers[index].approverCode = employee.employeeCode;
      newApprovers[index].approverName = employee.fullName;
      newApprovers[index].approverId = employee.employeeBasicDetailId;
      setApprovers(newApprovers);
      return;
    }
    if (value.length > 2) {
      setOptions(value, index);
    }
    if (!value) {
      newApprovers[index].searchResults = [];
      newApprovers[index].approverCode = null;
      newApprovers[index].approverId = null;
      newApprovers[index].approverName = "";
      setApprovers(newApprovers);
    }
  };

  const handleSave = () => {
    const atLeastOneAssigned = approvers.some((data) => data.approverId);
    if (!atLeastOneAssigned) {
      Toaster("error", "Please assign at least 1 approver to submit");
      return;
    }

    const req = {
      createdBy: userData?.emailId,
      empBasicDetailId: employeeData?.employeeBasicDetailId,
      approverConfigSubModels: approvers.map((data) => ({
        approverId: data.approverId || null,
        module: data.moduleCode,
        userApproverConfigId: data.userApproverConfigId || null,
      })),
    };

    console.log(req);

    SaveApproverConfig(req)
      .then((res) => {
        if (res) {
          Toaster("success", "Employee configuration updated successfully");
          decisionClick("submit");
        } else {
          Toaster("error", "Failed to update employee configuration");
        }
      })
      .catch();
  };

  useEffect(() => {
    GetAllByEmpId({
      employeeBasicDetailId: employeeData?.employeeBasicDetailId,
    })
      .then((res) => {
        if (res?.length) {
          setApprovers(
            [...approverConfigMasterData].map((data) => {
              const match = res.find(
                (a) =>
                  a.moduleName?.toLowerCase() === data.moduleCode?.toLowerCase()
              );
              return {
                userApproverConfigId: match?.userApproverConfigId,
                approverCode: match?.approverCode,
                approverName: match?.approverName,
                approverId: match?.approverId,
                moduleCode: data.moduleCode,
                module: data.module,
              };
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        Toaster("error", "Something went wrong");
      });
  }, [employeeData?.employeeBasicDetailId]);

  const configForm = (input) => {
    return [
      {
        name: "approverName",
        label: "Approver",
        type: "suggestedDropdown",
        value: input.approverName,
        required: true,
        options: input?.searchResults?.map((data) => {
          return {
            key: data.employeeCode,
            value: data.fullName,
            subValue: data.emailId,
          };
        }),
      },
    ];
  };
  return (
    <Box sx={panelStyle} className="p-2">
      {/* Employee Details */}
      <Box className="mb-4">
        <Box className="mb-2 flex flex-col justify-center gap-4">
          <Typography variant="body1" color="black">
            <strong>Name: </strong>{" "}
            {`${employeeData?.firstName} ${employeeData?.lastName}`}
          </Typography>
          <Typography variant="body1" color="black">
            <strong>Designation: </strong> {employeeData?.designation}
          </Typography>
          <Typography variant="body1" color="black">
            <strong>E-Mail ID: </strong> {employeeData?.emailId}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} className="mb-4">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell>Approver name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvers?.map((row, index) => (
              <TableRow key={index + "_"}>
                <TableCell>{row.module}</TableCell>
                <TableCell>
                  <ConfigureForm
                    data={configForm(row)}
                    handleChange={(event) => handleChange(event, index)}
                    actionsHide={false}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions Panel */}
      <Box className="flex justify-end gap-4">
        <Button
          variant="contained"
          color="warning"
          onClick={() => decisionClick("reject")}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ApprovalConfig;
