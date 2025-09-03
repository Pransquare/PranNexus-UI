import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import PayrollDetails from "./PayrollDetails";
import PayrollUpload from "./PayrollUpload";
import { Tab, Tabs } from "@mui/material";
import { UserManagentCheck } from "../../../common/UserManagement";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";

function Payroll() {
  const [tabsVlaue, setTabsVlaue] = useState(0);
  const { employeeData } = useContext(EmployeeDataContext);

  const tabsChange = (event, value) => {
    setTabsVlaue(value);
    console.log(value); // For testing purposes, replace console.log with your own logic.
  };
  const tabsContainer = () => {
    switch (tabsVlaue) {
      case 0:
        return <PayrollDetails />;
      case 1:
        return <PayrollUpload />;
    }
  };
  useEffect(() => {
    if (employeeData?.genericProfile) {
      setTabsVlaue(1);
    }
  }, [employeeData?.genericProfile]);

  return (
    <Box sx={{ ...panelStyle }} component="div">
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px",
            minWidth: "50px",
            padding: "6px 12px",
          },
          "& .MuiTab-wrapper": {
            marginTop: "0",
          },
        }}
        value={tabsVlaue}
        onChange={tabsChange}
        variant="scrollable"
      >
        {UserManagentCheck("hr_tools_ems_payroll_details") &&
          !employeeData?.genericProfile && <Tab label="Payslip" value={0}/>}
        {UserManagentCheck("hr_tools_ems_payroll_upload") && (
          <Tab label="Payroll Upload" value={1}/>
        )}
        {false && <Tab label="Leave Report" />}
      </Tabs>
      {tabsContainer()}
    </Box>
  );
}

export default Payroll;
