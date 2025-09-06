import { Box } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { UserManagentCheck } from "../../../common/UserManagement";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeesByName } from "../../../service/api/nemsService/EmployeeService";
import {
  GetEmployeesByApproverId,
  GetTimesheetReport,
} from "../../../service/api/nemsService/TimeSheetService";
import { GetEmployeeProjects } from "../../../service/api/hrConfig/hrConfig";
import { GetAllProjects } from "../../../service/api/ProjectService";

function AttendanceReport() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [searchedEmployee, setSearchedEmployee] = useState();
  const [projects, setProjects] = useState();
  const hr_tools_nems_management_attendance_report = UserManagentCheck(
    "hr_tools_nems_management_attendance_report"
  );
  const hr_tools_nems_manager_attendance_report = UserManagentCheck(
    "hr_tools_nems_manager_attendance_report"
  );

  const configureFormData = useCallback(
    (input) => {
      let temp = [];
      temp.push({
        name: "employee",
        label: "Employee Name",
        type: "suggestedDropdown",
        value: input?.employee,
        required: true,
        options:
          searchResults?.map((data) => ({
            key: data.employeeCode,
            value: data.fullName,
            subValue: data.emailId,
          })) || [],
      });
      temp.push(
        {
          label: "Project",
          name: "project",
          type: "dropDownList",
          value: input?.project,
          options: projects?.map((data) => ({
            key: data.projectCode,
            value: data.projectName,
          })),
          required: true,
        },
        {
          label: "From Date",
          name: "dateFrom",
          type: "monthAndYearSelect",
          value: dayjs(input?.dateFrom),
          maxDate: dayjs(),
          minDate: dayjs(employeeData?.dateOfJoining),
          required: true,
        },
        {
          label: "To Date",
          name: "dateTo",
          type: "monthAndYearSelect",
          value: dayjs(input?.dateTo),
          minDate: dayjs(input?.dateFrom),
          maxDate: dayjs(),
          required: true,
        }
      );
      return temp;
    },
    [searchResults, employeeData, projects]
  );

  const filterEmployeeNamesForManager = async (data) => {
    const managerEmployeeData = await GetEmployeesByApproverId(
      employeeData?.employeeBasicDetailId,
      "timesheet"
    );
    return data.filter((a) =>
      managerEmployeeData.some(
        (b) => b.empBasicDetailId === a.employeeBasicDetailId
      )
    );
  };

  const setOptions = useCallback(
    (value) => {
      GetEmployeesByName(value)
        .then(async (data) => {
          switch (true) {
            case hr_tools_nems_management_attendance_report:
              setSearchResults(data);
              break;
            case hr_tools_nems_manager_attendance_report:
              setSearchResults(filterEmployeeNamesForManager(data));
              break;
            default:
              setSearchResults(
                data.filter(
                  (a) =>
                    a.employeeBasicDetailId ===
                    employeeData.employeeBasicDetailId
                )
              );
              break;
          }
        })
        .catch((error) => console.log(error));
    },
    [formData, employeeData]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "employee") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      const temp = searchResults?.find((data) => data.fullName === value);
      if (temp) {
        setSearchedEmployee(temp);
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
    setFormData();
    setSearchedEmployee();
  };

  const submitClicked = () => {
    if (!formData?.dateFrom || !formData?.dateTo) {
      Toaster(
        "error",
        "Please fill in both 'From Date' and 'To Date' before downloading."
      );
      return;
    }
    const payload = {
      fromDate: formData?.dateFrom?.format("YYYY-MM-DD"),
      toDate: formData?.dateTo?.format("YYYY-MM-DD"),
      employeeCode: searchedEmployee?.employeeCode || employeeData.employeeCode,
    };

    GetTimesheetReport(payload)
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TimesheetReport.xlsx"); // Set the file name here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Toaster("success", "The timesheet report was downloaded successfully.");
      })
      .catch((_error) => {
        Toaster("error", "An error occurred.");
      });
  };

  useEffect(() => {
    if (searchedEmployee) {
      axios
        .all([
          GetAllProjects(),
          GetEmployeeProjects(searchedEmployee?.employeeBasicDetailId),
        ])
        .then(
          axios.spread((getallProjects, getEmployeeProjects) => {
            if (getallProjects && getEmployeeProjects) {
              if (
                hr_tools_nems_management_attendance_report &&
                searchedEmployee?.employeeBasicDetailId ===
                  employeeData?.employeeBasicDetailId
              ) {
                setProjects(getallProjects);
                return;
              }
              setProjects(
                getallProjects.filter((a) =>
                  getEmployeeProjects.some(
                    (b) => b.projectCode === a.projectCode
                  )
                )
              );
            }
          })
        )
        .catch((error) => console.log(error));
    }
  }, [searchedEmployee, employeeData]);

  useEffect(() => {
    setSearchedEmployee({
      fullName: employeeData?.fullName,
      employeeCode: employeeData?.employeeCode,
      emailId: employeeData?.emailId,
      employeeBasicDetailId: employeeData?.employeeBasicDetailId,
    });
    setFormData((prev) => ({
      ...prev,
      employee: employeeData?.fullName,
    }));
  }, [employeeData]);

  return (
    <Box>
      <ConfigureForm
        data={configureFormData(formData)}
        handleChange={handleChange}
        buttonTitle="Download"
        submitClicked={submitClicked}
        resetButton={resetButton}
      />
    </Box>
  );
}

export default AttendanceReport;
