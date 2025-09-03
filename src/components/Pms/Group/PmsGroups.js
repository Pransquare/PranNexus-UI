import React, { useContext, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import GroupSubGroupSelector from "./GroupSubGroupSelector";
import EmployeeDataGrid from "./EmployeeDataGrid";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { GetEmployees } from "../../../service/api/pmsService/GetEmployees";
import { PostAppraisalDetails } from "../../../service/api/pmsService/PostAppraisalDetails";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import EmployeeAppraisalList from "./EmployeeAppraisalList";
import { UserManagentCheck } from "../../../common/UserManagement";
import { panelStyle } from "../../../common/customStyles/CustomStyles";

function PmsGroups() {
  const allTabs = [
    { label: "New", value: 0, permission: "hr_tools_apprisal_initiate" },
    {
      label: "Inprogress",
      value: 1,
      permission: "hr_tools_apprisal_inprogress",
    },
    { label: "Approved", value: 2, permission: "hr_tools_apprisal_approved" },
  ];

  const visibleTabs = allTabs.filter((tab) =>
    UserManagentCheck(tab.permission)
  );
  const { employeeData } = useContext(EmployeeDataContext);
  const [employeeDataList, setemployeeDataList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isInitiateDisabled, setIsInitiateDisabled] = useState(false);
  const [tabsVlaue, setTabsValue] = useState(() => {
    const firstVisible = allTabs.find((tab) =>
      UserManagentCheck(tab.permission)
    );
    return firstVisible ? firstVisible.value : 0;
  });
  const [group, setGroup] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const handleSearch = async (groupName, subGroupName) => {
    try {
      const response = await GetEmployees(groupName, subGroupName);
      setemployeeDataList(response);
      setPage(0);
      setIsInitiateDisabled(false);
      setGroup({
        group: groupName,
        subGroup: subGroupName,
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleRowSelectionChange = (newSelection) => {
    console.log("Selected rows in PmsGroups:", newSelection);
    setSelectedRows(newSelection);
  };

  const handleFormSubmit = async () => {
    if (selectedRows.length === 0) {
      Toaster("warning", "No employees selected");
      return;
    }

    try {
      const req = {
        ...group,
        user: employeeData?.emailId,
        performenceReviewModel: selectedRows.map((id) => ({
          emplBasicId: id.employeeBasicDetailId,
        })),
      };

      await PostAppraisalDetails(req);
      Toaster("success", "Appraisal details initiated successfully");
    } catch (error) {
      console.error("Error initiating appraisal details:", error);
      Toaster("error", error?.response?.data?.message);
    }
  };

  const handleFormReset = () => {
    setSelectedRows([]);
    setIsInitiateDisabled(false);
  };

  const tabsChange = (event, value) => {
    setTabsValue(value);
  };

  const tabsContainer = () => (
    <Box component="div" sx={{ p: 2 }}>
      {tabsVlaue === 0 && UserManagentCheck("hr_tools_apprisal_initiate") && (
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
            data={[]}
            handleChange={() => {}}
            buttonTitle="Initiate"
            submitClicked={handleFormSubmit}
            resetButton={handleFormReset}
            formDisabled={isInitiateDisabled}
            actionsHide={true}
            buttonsHide={{
              reset: false,
              save: true,
            }}
            sx={{ mt: 2 }}
          />
        </>
      )}
      {tabsVlaue === 1 && UserManagentCheck("hr_tools_apprisal_inprogress") && (
        <EmployeeAppraisalList tabValue={tabsVlaue} />
      )}
      {tabsVlaue === 2 && UserManagentCheck("hr_tools_apprisal_approved") && (
        <EmployeeAppraisalList tabValue={tabsVlaue} />
      )}
    </Box>
  );

  return (
    <Box sx={{ ...panelStyle, p: 0 }} component="div">
      <Tabs
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 10,
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
        {visibleTabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      {tabsContainer()}
    </Box>
  );
}

export default PmsGroups;
