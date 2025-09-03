import React, { useState } from "react";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Box } from "@mui/system";
import { Tab, Tabs } from "@mui/material";
import { UserManagentCheck } from "../../../common/UserManagement";
import AttendanceReport from "./AttendanceReport";

function Attendace() {
  const [tabsValue, setTabsValue] = useState(0);
  const tabContainer = () => <AttendanceReport />;
  const tabsChange = (_event, value) => {
    setTabsValue(value);
  };
  return (
    <Box sx={panelStyle}>
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
        value={tabsValue}
        onChange={tabsChange}
        variant="scrollable"
      >
        {UserManagentCheck("hr_tools_ems_employee_attendance_report") && (
          <Tab label="Attendance Report" value={0} />
        )}
      </Tabs>
      <Box>{tabContainer()}</Box>
    </Box>
  );
}

export default Attendace;
