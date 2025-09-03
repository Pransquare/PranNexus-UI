import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import GroupSubGroupSelector from "../Pms/Group/GroupSubGroupSelector";
import EmployeeDataGrid from "../Pms/Group/EmployeeDataGrid";
import EmployeeAppraisalList from "../Pms/Group/EmployeeAppraisalList";
import ConfigureForm from "../../common/customComponents/ConfigureForm";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { panelStyle } from "../../common/customStyles/CustomStyles";
import { UserManagentCheck } from "../../common/UserManagement";
import { GetEmployeesNew } from "../../service/api/pmsService/GetEmployees";
import { initiateGoalSetup } from "../../service/api/nemsService/GoalService";
import { Toaster } from "../../common/alertComponets/Toaster";

function InitiateGoals() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [employeeDataList, setEmployeeDataList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tabsValue, setTabsValue] = useState(0);
  const [group, setGroup] = useState({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [showGoalSetup, setShowGoalSetup] = useState(false);

  // Global From/To Dates
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSearch = async (groupName, subGroupName) => {
    try {
      const response = await GetEmployeesNew(groupName, subGroupName);
      setEmployeeDataList(response);
      setPage(0);
      setGroup({ group: groupName, subGroup: subGroupName });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleRowSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleFormSubmit = async () => {
    if (selectedRows.length === 0) {
      Toaster("warning", "No employee selected");
      return;
    }

    if (!fromDate || !toDate) {
      Toaster("warning", "Both From and To dates are required.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      Toaster("warning", "From Date cannot be after To Date.");
      return;
    }

    const payload = selectedRows.map((emp) => ({
      empGoalSetupId: 0,
      emplBasicId: Number(emp.employeeBasicDetailId),
      createdBy: emp.emailId,
      fromDate,
      toDate,
    }));

    try {
      await initiateGoalSetup(payload);
      Toaster(
        "success",
        "Goal setup initiated successfully for selected employees."
      );
      setSelectedRows([]);
      setShowGoalSetup(false);
      setFromDate("");
      setToDate("");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to initiate goal setup.";
      console.error("Error initiating goal setup:", error);
      Toaster("error", errorMsg);
    }
  };

  const handleReset = () => {
    setSelectedRows([]);
    setFromDate("");
    setToDate("");
    setShowGoalSetup(false);
  };

  const tabsChange = (_, value) => setTabsValue(value);

  const renderTabs = () => (
    <Tabs
      sx={{
        borderBottom: "1px solid #e8e8e8",
        "& .MuiTab-root": {
          fontSize: "12px",
          minWidth: "50px",
          padding: "6px 12px",
        },
        "& .MuiTab-wrapper": {
          marginTop: 0,
        },
      }}
      value={tabsValue}
      onChange={tabsChange}
      variant="scrollable"
    >
      {UserManagentCheck("hr_tools_apprisal_initiate") && <Tab label="New" />}
    </Tabs>
  );

  const renderTabContent = () => (
    <Box sx={{ p: 2 }}>
      {tabsValue === 0 && (
        <>
          <GroupSubGroupSelector onSearch={handleSearch} />
          <EmployeeDataGrid
            employeeData={employeeDataList}
            onRowSelectionChange={handleRowSelectionChange}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
          <ConfigureForm
            data={[
              {
                type: "datePicker",
                name: "fromDate",
                label: "From Date",
                value: fromDate,
                required: true,
              },
              {
                type: "datePicker",
                name: "toDate",
                label: "To Date",
                value: toDate,
                required: true,
              },
            ]}
            handleChange={(e) => {
              const { name, value } = e.target;
              if (name === "fromDate") setFromDate(value);
              if (name === "toDate") setToDate(value);
            }}
            buttonTitle="Initiate"
            submitClicked={handleFormSubmit}
            resetButton={handleReset}
            formDisabled={false}
            buttonsHide={{ reset: false, save: true }}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ ...panelStyle, p: 0 }} component="div">
      {renderTabs()}
      {renderTabContent()}

      {showGoalSetup && selectedRows.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRows.map((entry) => (
                <TableRow key={entry.employeeCode}>
                  <TableCell>{entry.employeeCode}</TableCell>
                  <TableCell>{entry.fullName}</TableCell>
                  <TableCell>{entry.emailId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default InitiateGoals;
