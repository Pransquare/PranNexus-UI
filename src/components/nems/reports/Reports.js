import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ProjectReport from "./ProjectReport/ProjectReport";

function Reports() {
  const params = useParams();
  const [tabsValue, setTabsValue] = useState(params.id || 0);
  const tabContainer = () => {
    switch (tabsValue) {
      case 0:
        return <ProjectReport />;
      default:
        return null;
    }
  };
  const tabsChange = (_event, value) => {
    setTabsValue(value);
  };

  return (
    <Box sx={{ ...panelStyle, paddingBottom: "1rem" }}>
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
        {/* {UserManagentCheck("project_report") && ( */}
        <Tab label="Project Report" value={0} />
        {/* )} */}
      </Tabs>
      <Box>{tabContainer()}</Box>
    </Box>
  );
}

export default Reports;
