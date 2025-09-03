import { Box, Button, Tab, Tabs } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfigTable from "../../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../../common/customStyles/CustomStyles";
import { UserManagentCheck } from "../../../../common/UserManagement";
import { EmployeeDataContext } from "../../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeesByName } from "../../../../service/api/emsService/EmployeeService";
import { Search } from "../../../../service/api/ExpenseService";
import { currencySymbols } from "../ExpenseSubmission/ExpenseSubmission";

const defaultFormData = {
  employeeId: "",
  recordType: "my records",
};

function ExpenseRecords() {
  const rolenames = {
    role_for_all_expenses: UserManagentCheck("role_for_all_expenses"),
    expense_manager_approval: UserManagentCheck("expense_manager_approval"),
    expense_accounts_approval: UserManagentCheck("expense_accounts_approval"),
    expense_leaseship_approval: UserManagentCheck("expense_leaseship_approval"),
    expense_finance_approval: UserManagentCheck("expense_finance_approval"),
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // Track the active tab
  const { employeeData } = useContext(EmployeeDataContext);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  const fetchExpenseRecords = (employeeId, managerId) => {
    try {
      let status = [];
      if (rolenames.expense_manager_approval) {
        status.push("113");
      }
      if (rolenames.expense_accounts_approval) {
        status.push("121");
      }
      if (rolenames.expense_leaseship_approval) {
        status.push("122");
      }
      if (rolenames.expense_finance_approval) {
        status.push("123");
      }
      const req = {
        employeeId,
        managerId: rolenames?.role_for_all_expenses ? null : managerId,
        page,
        size: rowsPerPage,
        status: activeTab === 1 ? status : null,
      };
      Search(req)
        .then((a) => {
          setData(a.content); // Replace with actual API data
          setTotalCount(a.total);
        })
        .catch();
    } catch (error) {
      setData([]);
      console.log(error);
    }
  };
  const view = (data) => {
    navigate(`/home/finance/expense/submission/${data.id}`);
  };

  const customButtons = (rowData) => {
    return (
      <Box>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={() => view(rowData)}
        >
          View
        </Button>
      </Box>
    );
  };

  const contentConfig = useCallback(
    (input) => {
      return {
        content: input.map((content) => {
          return [
            { forAction: false, isPrint: true, value: content.empoyeeName },
            { forAction: false, isPrint: true, value: content.expenseName },
            {
              forAction: false,
              isPrint: true,
              value: `${currencySymbols[content.expenseAmtType]} ${
                content.expenseAmount
              }`,
            },
            {
              forAction: false,
              isPrint: true,
              value: `${content.from} - ${content.to}`,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.statusDescription,
            },
            {
              forAction: true,
              isPrint: false,
              value: content,
              customActions: customButtons(content),
            },
          ];
        }),
        actions: {
          view: false,
          edit: false,
        },
      };
    },
    [data]
  );

  const handleTabChange = (event, newValue) => {
    const hasApprovalRole =
      rolenames.expense_manager_approval ||
      rolenames.expense_accounts_approval ||
      rolenames.expense_leaseship_approval ||
      rolenames.expense_finance_approval;

    if (!hasApprovalRole && newValue === 1) return;
    setActiveTab(newValue);
    setPage(0);
  };

  const onPageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const employeeBasicDetailId = searchResults?.find(
      (data) => data.fullName === value
    )?.employeeBasicDetailId;
    if (employeeBasicDetailId) {
      setSearchResults([]);
      fetchExpenseRecords(
        employeeBasicDetailId,
        employeeData?.employeeBasicDetailId
      );
      return;
    }
    if (value.length > 2) {
      setOptions(value);
    }
    setSearchResults([]);
    if (!value) {
      fetchExpenseRecords(null, employeeData?.employeeBasicDetailId);
    }
  };

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => {
        setSearchResults(data);
      })
      .catch();
  }, []);

  const configForm = useCallback(
    (input) => {
      return [
        {
          name: "employee",
          label: "Employee Name",
          type: "suggestedDropdown",
          value: input.employee,
          required: true,
          options:
            searchResults.map((data) => {
              return {
                key: data.employeeCode,
                value: data.fullName,
                subValue: data.emailId,
              };
            }) || [],
        },
      ];
    },
    [searchResults]
  );
  useEffect(() => {
    const hasApprovalRole =
      rolenames.expense_manager_approval ||
      rolenames.expense_accounts_approval ||
      rolenames.expense_leaseship_approval ||
      rolenames.expense_finance_approval;

    if (!hasApprovalRole && activeTab === 1) {
      setActiveTab(0);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchExpenseRecords(employeeData?.employeeBasicDetailId, null);
    } else {
      fetchExpenseRecords(null, employeeData?.employeeBasicDetailId);
    }
  }, [page, rowsPerPage, activeTab, employeeData]);

  return (
    <Box sx={{ ...panelStyle }}>
      {/* Tabs for My Records and Pending Records */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
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
        variant="scrollable"
      >
        <Tab label="My Records" />
        {(rolenames.expense_manager_approval ||
          rolenames.expense_accounts_approval ||
          rolenames.expense_leaseship_approval ||
          rolenames.expense_finance_approval) && (
          <Tab label="Pending Approvals" />
        )}
      </Tabs>

      {activeTab === 1 && (
        <ConfigureForm
          data={configForm(formData)}
          handleChange={handleChange}
          actionsHide={false}
        />
      )}

      <ConfigTable
        data={contentConfig(data)}
        headers={[
          "Employee Name",
          "Expense Name",
          "Amount",
          "Expense From - To",
          "Status",
          "Action",
        ]}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        totalCount={totalCount}
      />
    </Box>
  );
}

export default ExpenseRecords;
