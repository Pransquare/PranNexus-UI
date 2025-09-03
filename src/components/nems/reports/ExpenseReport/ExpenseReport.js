import { Box, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import React, { useCallback, useContext, useState } from "react";
import { UserManagentCheck } from "../../../../common/UserManagement";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeesByName } from "../../../../service/api/nemsService/EmployeeService";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import { DownloadExpenseReport } from "../../../../service/api/ExpenseService";

function ExpenseReport() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState();
  const [searchResults, setSearchResults] = useState();
  const roleNames = {
    expense_report_for_all: UserManagentCheck("expense_report_for_all"),
  };
  const configForm = useCallback(
    (input) => {
      let temp = [
        {
          label: "Month and Year",
          name: "monthAndYear",
          type: "monthAndYearSelect",
          value: input?.monthAndYear,
          maxDate: dayjs(),
          required: true,
        },
      ];
      if (roleNames.expense_report_for_all) {
        temp.push({
          name: "employee",
          label: "Employee Name",
          type: "suggestedDropdown",
          value: input?.employee,
          options:
            searchResults?.map((data) => {
              return {
                key: data.employeeCode,
                value: data.fullName,
                subValue: data.emailId,
              };
            }) || [],
        });
      }
      return temp;
    },
    [roleNames.expense_report_for_all, searchResults]
  );
  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => console.log(error));
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "employee") {
      const employeeBasicDetailId = searchResults?.find(
        (data) => data.fullName === value
      )?.employeeBasicDetailId;
      if (employeeBasicDetailId) {
        setSearchResults([]);
        setFormData((prev) => ({
          ...prev,
          selectedEmployee: employeeBasicDetailId,
        }));
        return;
      }
      if (value.length > 2) {
        setOptions(value);
      }
      setSearchResults([]);
      setFormData((prev) => ({
        ...prev,
        selectedEmployee: null,
      }));
    }
  };
  const submitClicked = () => {
    if (!formData.monthAndYear) {
      Toaster("error", "Please select month and year");
      return;
    }
    DownloadExpenseReport(
      formData.selectedEmployee,
      dayjs(formData.monthAndYear).format("YYYY-MM-DD")
    );
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
        value={0}
        variant="scrollable"
      >
        <Tab label="Expense Report" value={0} />
      </Tabs>
      <Box>
        <ConfigureForm
          data={configForm(formData)}
          handleChange={handleChange}
          buttonTitle="Download"
          submitClicked={submitClicked}
          resetButton={() => {
            setFormData({});
            setSearchResults([]);
          }}
        />
      </Box>
    </Box>
  );
}

export default ExpenseReport;
