import { Box } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  findEmployeeLeaveDetailsForGrid,
  GenerateLeaveReport,
  GetEmployeesByApproverId,
} from "../../../service/api/emsService/TimeSheetService";
import { UserManagentCheck } from "../../../common/UserManagement";
import { GetEmployeesByName } from "../../../service/api/emsService/EmployeeService";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { Button } from "@mui/material";

function LeaveReport() {
  const { employeeData } = useContext(EmployeeDataContext);
  const roles = employeeData?.roles || [];

  const [employeesData, setEmployeesData] = useState([]);
  const [formData, setFormData] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchedEmployee, setSearchedEmployee] = useState();
  const [leaveData, setLeaveData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const roleNames = {
    hr_tools_ems_leave_manager_report: UserManagentCheck(
      "hr_tools_ems_leave_manager_report",
      roles
    ),
    hr_tools_ems_leave_leaveApproval: UserManagentCheck(
      "hr_tools_ems_leave_leaveApproval",
      roles
    ),
  };

  const getEmployeesByApproverId = () => {
    GetEmployeesByApproverId(employeeData?.employeeBasicDetailId, "leave")
      .then((employees) => setEmployeesData(employees))
      .catch(() => setEmployeesData([]));
  };

  const configureFormData = useCallback(
    (input) => {
      let temp = [];
      if (employeeData?.genericProfile) {
        temp.push({
          name: "employee",
          label: "Employee Name",
          type: "suggestedDropdown",
          value: input?.employee,
          options:
            searchResults?.map((data) => ({
              key: data.employeeCode,
              value: data.fullName,
              subValue: data.emailId,
            })) || [],
        });
      } else if (roleNames.hr_tools_ems_leave_manager_report) {
        temp.push({
          label: "Employee",
          name: "employeeId",
          type: "dropDownList",
          options: [
            ...employeesData?.map((employee) => ({
              key: employee?.employeeBasicDetail?.employeeCode,
              value: `${employee.employeeName} (${employee?.employeeBasicDetail?.employeeCode})`,
            })),
            {
              key: employeeData?.employeeCode,
              value: "Self",
            },
          ],
          value: input?.employeeId?.includes("Self")
            ? "Self"
            : employeesData?.find(
                (emp) =>
                  emp?.employeeBasicDetail?.employeeBasicDetailId ===
                  input?.employeeId
              )?.employeeBasicDetail?.employeeCode || input?.employeeId,
        });
      }

      temp.push(
        {
          label: "Date From",
          name: "dateFrom",
          type: "datePicker",
          value: input?.dateFrom ? dayjs(input?.dateFrom) : null,
          maxDate: dayjs(),
          minDate: dayjs(employeeData?.dateOfJoining),
          required: true,
        },
        {
          label: "Date To",
          name: "dateTo",
          type: "datePicker",
          value: input?.dateTo ? dayjs(input?.dateTo) : null,
          minDate: dayjs(input?.dateFrom),
          maxDate: dayjs(),
          required: true,
        }
      );

      return temp;
    },
    [
      employeeData?.dateOfJoining,
      employeeData?.employeeCode,
      searchResults,
      employeesData,
      roleNames,
    ]
  );

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => setSearchResults(data))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "employee") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      const employeeBasicDetailId = searchResults?.find(
        (data) => data.fullName === value
      )?.employeeBasicDetailId;
      setSearchedEmployee(employeeBasicDetailId);
      if (employeeBasicDetailId) {
        setSearchResults([]);
        return;
      }
      if (value.length > 2) {
        setOptions(value);
      } else {
        setSearchResults([]);
        setSearchedEmployee(null);
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const resetButton = () => {
    setFormData({});
    setSearchedEmployee();
  };

  const submitClicked = async () => {
    if (!formData?.dateFrom || !formData?.dateTo) {
      Toaster("error", "Please select 'From' and 'To' dates.");
      return;
    }

    try {
      const fromDate = dayjs(formData.dateFrom).format("YYYY-MM-DD");
      const toDate = dayjs(formData.dateTo).format("YYYY-MM-DD");

      let payload = {
        leaveFrom: fromDate,
        leaveTo: toDate,
      };

      const isHR = employeeData?.genericProfile;
      const isManager = roleNames?.hr_tools_ems_leave_leaveApproval;
      const isEmployee = !isHR && !isManager;

      if (isHR) {
        if (formData?.employee) {
          const selectedEmp = searchResults.find(
            (emp) => emp.fullName === formData.employee
          );
          if (selectedEmp) {
            payload.employeeCode = selectedEmp.employeeCode;
          }
        }
      } else if (isManager) {
        if (formData?.employeeId === "Self") {
          payload.employeeCode = employeeData?.employeeCode;
        } else {
          const selectedEmp = employeesData.find(
            (emp) =>
              emp?.employeeBasicDetail?.employeeCode === formData.employeeId
          );
          if (selectedEmp) {
            payload.employeeCode =
              selectedEmp?.employeeBasicDetail?.employeeCode;
            payload.approver1 = employeeData?.employeeBasicDetailId;
          }
        }
      } else if (isEmployee) {
        payload.employeeCode = employeeData?.employeeCode;
      }

      const blob = await GenerateLeaveReport(payload);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Leave_Report.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Toaster("success", "Leave report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading the report:", error);
      Toaster("error", "Error downloading the report");
    }
  };

  const searchButtonClicked = async () => {
    if (!formData?.dateFrom || !formData?.dateTo) {
      Toaster("error", "Please select 'From' and 'To' dates.");
      return;
    }

    const fromDate = dayjs(formData?.dateFrom).format("YYYY-MM-DD");
    const toDate = dayjs(formData?.dateTo).format("YYYY-MM-DD");

    const isHR = employeeData?.genericProfile;
    const isManager = roleNames?.hr_tools_ems_leave_leaveApproval;
    const isEmployee = !isHR && !isManager;

    const payload = {
      leaveFrom: fromDate,
      leaveTo: toDate,
      page,
      size: pageSize,
    };

    if (isHR) {
      if (searchedEmployee) {
        payload.employeeId = searchedEmployee;
      }
    } else if (isManager) {
      if (formData?.employeeId === "Self") {
        payload.employeeId = employeeData?.employeeBasicDetailId;
      } else if (formData?.employeeId) {
        const selectedEmp = employeesData.find(
          (emp) =>
            emp?.employeeBasicDetail?.employeeCode === formData.employeeId
        );
        if (selectedEmp) {
          payload.employeeId =
            selectedEmp?.employeeBasicDetail?.employeeBasicDetailId;
          payload.approver1 = employeeData?.employeeBasicDetailId;
        }
      } else {
        payload.approver1 = employeeData?.employeeBasicDetailId;
      }
    } else if (isEmployee) {
      payload.employeeId = employeeData?.employeeBasicDetailId;
    }

    try {
      const response = await findEmployeeLeaveDetailsForGrid(payload);

      if (response.content && Array.isArray(response.content)) {
        const leaveDetails = response.content.map((item) => {
          const forActionValue = item.empLeaveId;
          return [
            {
              value: item.employeeBasicDetails?.fullName || "N/A",
              isPrint: true,
            },
            {
              value: item.leaveType || "N/A",
              isPrint: true,
            },
            {
              value: dayjs(item.leaveFrom).format("DD/MM/YYYY"),
              isPrint: true,
            },
            {
              value: dayjs(item.leaveTo).format("DD/MM/YYYY"),
              isPrint: true,
            },
            {
              value: item.noOfDays,
              isPrint: true,
            },
            {
              value: item.statusMasterEntity?.description || "N/A",
              isPrint: true,
            },
            {
              value: forActionValue,
              isPrint: false,
              forAction: true,
              customActions: null,
            },
          ];
        });

        setLeaveData(leaveDetails);
        setTotalPages(response.totalPages);
      } else {
        Toaster("error", "No leave details found");
      }
    } catch (error) {
      console.error("Error fetching leave details:", error);
      Toaster("error", "Failed to fetch leave details");
    }
  };

  useEffect(() => {
    getEmployeesByApproverId();
  }, [employeeData]);

  return (
    <Box>
      <ConfigureForm
        data={configureFormData(formData)}
        handleChange={handleChange}
        buttonsHide={{ reset: false, save: false }} // ✅ Hides both buttons
      />
      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
        <Button variant="contained" onClick={submitClicked}>
          Download Report
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={searchButtonClicked}
          sx={{ textTransform: "uppercase" }}
        >
          Show Report
        </Button>
      </Box>

      <ConfigTable
        data={{ content: leaveData }}
        headers={[
          "Employee Name",
          "Leave Type",
          "From Date",
          "To Date",
          "No of Days",
          "Status",
        ]}
        actions={() => {}}
        pagination={true}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setPageSize(e.target.value)}
        totalCount={totalPages}
        selectionTable={false}
        onSelectedRowsChange={() => {}}
      />
    </Box>
  );
}

export default LeaveReport;
