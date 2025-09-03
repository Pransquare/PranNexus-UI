import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import {
  GetWeekendApprovals,
  SendForApprovalAndApprove,
  SerchAttendanceDetails,
} from "../../../service/api/nemsService/TimeSheetService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { Delete } from "@mui/icons-material";
const defaultFormData = {
  yearMonth: "",
  projectCode: "",
};
function TimeSheetSummary({ projects, tasks }) {
  const { employeeData } = useContext(EmployeeDataContext);
  const [timesheetData, settimesheetData] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [pagableObj, setPagableObj] = useState({
    page: 0,
    size: 5,
    totalCount: 0,
  });
  const [alignment, setAlignment] = useState("task summary");

  const getTimesheetDetails = useCallback(() => {
    settimesheetData([]);
    if (alignment === "entry date summary") {
      const payload = {
        empBasicDetailId: employeeData?.employeeBasicDetailId,
        status: ["102", "103", "101"],
        size: pagableObj.size,
        page: pagableObj.page,
      };
      GetWeekendApprovals(payload)
        .then((res) => {
          if (res?.data?.content?.length) {
            settimesheetData(res.data.content);
            setPagableObj((prev) => ({
              ...prev,
              totalCount: res.data.totalElements,
            }));
          } else {
            settimesheetData([]);
          }
        })
        .catch((_error) => {
          settimesheetData([]);
        });
      return;
    }
    SerchAttendanceDetails({
      empBasicDetailId: employeeData?.employeeBasicDetailId,
      yearAndMonth: formData.yearMonth
        ? formData.yearMonth.format("YYYY-MM-DD")
        : null,
      projectCode: formData.project || null,
      size: pagableObj.size,
      page: pagableObj.page,
    })
      .then((response) => {
        if (response && response.data) {
          response.data.content
            .filter((data) => data.status !== "109")
            .forEach((element) => {
              element["project"] = element.projectCode;
              element["task"] = element.taskName;
              element["hoursWorked"] = element.timeInvested;
              element["description"] = element.comments;
            });
          settimesheetData(response.data.content);
          setPagableObj((prev) => ({
            ...prev,
            totalCount: response.data.totalElements,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        settimesheetData([]);
        Toaster("error", "Failed to fetch Timesheet Details.");
      });
  }, [
    alignment,
    employeeData?.employeeBasicDetailId,
    formData.project,
    formData.yearMonth,
    pagableObj.page,
    pagableObj.size,
  ]);
  useEffect(() => {
    getTimesheetDetails();
  }, [
    formData,
    getTimesheetDetails,
    pagableObj.page,
    pagableObj.size,
    alignment,
  ]);

  const deleteData = useCallback(
    (item) => {
      SendForApprovalAndApprove({
        attendanceEmpIdModels: [
          {
            attendanceId: item.attendanceId,
            status: "109",
          },
        ],
        basicEmpDetailId: employeeData?.employeeBasicDetailId,
      })
        .then((response) => {
          if (response) {
            getTimesheetDetails();
            Toaster("success", "Entry deleted successfully");
          }
        })
        .catch();
    },
    [employeeData?.employeeBasicDetailId, getTimesheetDetails]
  );

  const contentConfig = useCallback(
    (timesheetData) => {
      return {
        actions:
          alignment === "entry date summary"
            ? null
            : {
                delete: false,
              },
        content: timesheetData?.map((timesheetData) => {
          if (alignment === "entry date summary") {
            return [
              {
                isPrint: true,
                forAction: false,
                value: timesheetData?.taskDate,
              },
              {
                isPrint: true,
                forAction: false,
                value: timesheetData?.statusDes,
              },
            ];
          }
          return [
            {
              isPrint: true,
              forAction: false,
              value: timesheetData?.taskDate,
            },
            {
              forAction: false,
              isPrint: true,
              value: timesheetData?.createdDate?.split("T")[0],
            },
            {
              isPrint: true,
              forAction: false,
              value: projects?.find(
                (data) => data.projectCode === timesheetData?.projectCode
              )?.projectName,
            },

            {
              forAction: false,
              isPrint: true,
              value: timesheetData?.hoursWorked,
            },
            {
              forAction: false,
              isPrint: true,
              value: tasks?.find(
                (data) => data.taskCode === timesheetData?.task
              )?.taskDescription,
            },
            {
              forAction: false,
              isPrint: true,
              value: timesheetData?.statusMasterEntity?.description,
            },
            {
              forAction: false,
              isPrint: true,
              value: timesheetData?.approverComments,
            },
            {
              forAction: true,
              isPrint: false,
              value: timesheetData,
              customActions: timesheetData?.status === "101" && (
                <IconButton
                  color="warning"
                  aria-label="delete"
                  onClick={() => deleteData(timesheetData)}
                >
                  <Delete fontSize="small" color="warning" />
                </IconButton>
              ),
            },
          ];
        }),
      };
    },
    [alignment, deleteData, projects, tasks]
  );

  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Year & Month",
          name: "yearMonth",
          type: "monthAndYearSelect",
          value: formData.yearMonth,
        },
        {
          label: "Project",
          name: "project",
          type: "dropDownList",
          options: projects?.map((project) => ({
            key: project.projectCode,
            value: project.projectName,
          })),
          value: formData.project,
        },
      ];
    },
    [projects]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const resetButton = useCallback(() => {
    setFormData(defaultFormData);
    getTimesheetDetails();
  }, []);

  const onPageChange = useCallback((_event, newPage) => {
    setPagableObj((prev) => ({ ...prev, page: newPage }));
  }, []);

  const onRowsPerPageChange = useCallback((event) => {
    setPagableObj((prev) => ({ ...prev, size: event.target.value }));
  }, []);

  return (
    <Box>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={(_event, newAlignment) => setAlignment(newAlignment)}
        aria-label="Platform"
        size="small"
        sx={{ margin: 1 }}
      >
        <ToggleButton value="task summary">task summary</ToggleButton>
        <ToggleButton value="entry date summary">
          entry date summary
        </ToggleButton>
      </ToggleButtonGroup>
      {alignment === "task summary" && (
        <ConfigureForm
          data={configureFormData(formData)}
          handleChange={handleChange}
          buttonsHide={{ reset: true }}
          resetButton={resetButton}
        />
      )}
      <ConfigTable
        data={contentConfig(timesheetData)}
        headers={
          alignment === "entry date summary"
            ? ["Task Date", "Status"]
            : [
                "Task Date",
                "Entry Date",
                "Project Name",
                "Hours Worked",
                "Task",
                "Status",
                "Approver Comments",
                "Action",
              ]
        }
        pagination={true}
        page={pagableObj.page}
        rowsPerPage={pagableObj.size}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        totalCount={pagableObj.totalCount}
      />
    </Box>
  );
}

export default TimeSheetSummary;
