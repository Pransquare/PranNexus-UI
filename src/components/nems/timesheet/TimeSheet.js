import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserManagentCheck } from "../../../common/UserManagement";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllProjects } from "../../../service/api/ProjectService";
import { GetAllTasks } from "../../../service/api/nemsService/TaskService";
import {
  CreateOrUpdateTimesheet,
  SaveAndApproveWeekend,
  SendForApprovalAndApprove,
  SerchAttendanceDetails,
  WeekendDateCheck,
} from "../../../service/api/nemsService/TimeSheetService";
import {
  GetAllWorkLocation,
  GetEmployeeProjects,
} from "../../../service/api/hrConfig/hrConfig";
import TimeSheetApproval from "./TimeSheetApproval";
import TimeSheetSummary from "./TimesheetSummary";
import TimesheetReport from "./TimesheetReport";
import ContentDialog from "../../../common/customComponents/Dailogs/ContentDailog";

const getValidTaskDate = () => {
  let date = dayjs(); // Get today's date
  if (date.day() === 6) {
    date = date.subtract(1, "day"); // Move to Friday
  } else if (date.day() === 0) {
    date = date.subtract(2, "day"); // Move to Friday
  }
  return date;
};

let defaultFormData = {
  timesheetId: null,
  project: "",
  taskDate: getValidTaskDate(), // Ensure it's a weekday
  hoursWorked: "00:00",
  isBillable: false,
  task: "",
  location: "",
  description: "",
};

const defaultErrors = {
  project: "",
  taskDate: "",
  hoursWorked: "",
  task: "",
  location: "",
  description: "",
};

function Timesheet() {
  const [tabsValue, setTabsValue] = useState(0);
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [selectedTimeSheet, setSelectedTimeSheet] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [resetSelection, setResetSelection] = useState(false);
  const [contentDialog, setContentDialog] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const validate = useCallback(() => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.project) {
      tempErrors.project = "Project is required.";
      isValid = false;
    }

    if (!formData.taskDate) {
      tempErrors.taskDate = "Task date is required.";
      isValid = false;
    }

    const hoursWorkedPattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    let hoursWorked = dayjs(formData.hoursWorked).isValid()
      ? formData.hoursWorked
      : dayjs(formData.hoursWorked, "HH:mm");
    if (!hoursWorked) {
      tempErrors.hoursWorked = "Worked hours is mandatory.";
      isValid = false;
    } else if (!hoursWorkedPattern.test(hoursWorked.format("HH:mm"))) {
      tempErrors.hoursWorked = "Worked Hours must follow the 00:00 pattern.";
      isValid = false;
    } else {
      const [hours, minutes] = hoursWorked
        .format("HH:mm")
        .split(":")
        .map(Number);
      const totalHours = parseFloat(`${hours}.${minutes}`);

      if (totalHours > 12.0) {
        tempErrors.hoursWorked = "Worked Hours must be less than 12 hours.";
        isValid = false;
      } else if (totalHours === 0.0) {
        tempErrors.hoursWorked = "Worked Hours cannot be 00:00.";
        isValid = false;
      }
    }

    if (!formData.task) {
      tempErrors.task = "Task is required.";
      isValid = false;
    }

    if (!formData.location) {
      tempErrors.location = "Location is required.";
      isValid = false;
    }

    if (!formData.description) {
      tempErrors.description = "Description is required.";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      tempErrors.description =
        "Description must be at least 10 characters long.";
    }

    setErrors(tempErrors);
    return isValid;
  }, [formData]);

  const contentConfig = useCallback(
    (input) => {
      return {
        actions: {
          edit: true,
          delete: true,
          view: true,
        },
        content: input.map((content) => {
          return [
            {
              isPrint: true,
              forAction: false,
              value: content.taskDate,
            },
            {
              forAction: false,
              isPrint: true,
              value: allProjects.find(
                (data) => data.projectCode === content.project
              )?.projectName,
            },
            {
              forAction: false,
              isPrint: true,
              value: allTasks.find((data) => data.taskCode === content.task)
                ?.taskDescription,
            },
            {
              isPrint: true,
              forAction: false,
              value: content.hoursWorked,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.isBillable ? "Yes" : "No",
            },
            {
              forAction: true,
              isPrint: false,
              value: { ...content },
            },
          ];
        }),
      };
    },
    [allProjects, allTasks]
  );

  const contentPrevDataConfig = useCallback(
    (input) => {
      return {
        content: input.map((content) => {
          return [
            {
              isPrint: true,
              forAction: false,
              value: content.taskDate,
            },
            {
              forAction: false,
              isPrint: true,
              value: allProjects.find(
                (data) => data.projectCode === content.projectCode
              )?.projectName,
            },
            {
              forAction: false,
              isPrint: true,
              value: allTasks.find((data) => data.taskCode === content.taskName)
                ?.taskDescription,
            },
            {
              isPrint: true,
              forAction: false,
              value: content.timeInvested,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.isBillable ? "Yes" : "No",
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.statusMasterEntity?.description,
            },
          ];
        }),
      };
    },
    [allProjects, allTasks]
  );

  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Task Date",
          name: "taskDate",
          type: "datePicker",
          value: dayjs(formData.taskDate),
          maxDate: dayjs(),
          minDate: dayjs(employeeData?.dateOfJoining),
          error: errors.taskDate,
          required: true,
        },
        {
          label: "Project",
          name: "project",
          type: "dropDownList",
          value: formData.project,
          options: projectData?.map((project) => ({
            key: project.projectCode,
            value: project.projectName,
          })),
          error: errors.project,
          required: true,
        },
        {
          label: "Client",
          name: "client",
          type: "text",
          readOnly: true,
          value: projectData.find(
            (data) => data.projectCode === formData.project
          )?.clientName,
        },
        {
          label: "Task",
          name: "task",
          type: "dropDownList",
          value: formData.task,
          options: projectData
            ?.find((data) => data.projectCode === formData.project)
            ?.tasks?.map((task) => ({
              key: task.taskCode,
              value: allTasks.find((data) => data.taskCode === task.taskCode)
                ?.taskDescription,
            })),
          error: errors.task,
          required: true,
        },
        {
          label: "Worked hours",
          name: "hoursWorked",
          type: "time",
          value: dayjs(formData.hoursWorked, "HH:mm"),
          error: errors.hoursWorked,
          required: true,
        },

        {
          label: "Billable",
          name: "isBillable",
          type: "checkbox",
          value: formData.isBillable,
          disable: employeeData?.workType?.toLowerCase() !== "permanent",
        },
        {
          label: "Location",
          name: "location",
          type: "text",
          value: formData.location,
          error: errors.location,
          required: true,
        },

        {
          label: "Description",
          name: "description",
          type: "textarea",
          value: formData.description,
          error: errors.description,
          required: true,
        },
      ];
    },
    [formData, errors, projectData, taskData]
  );

  const handleChange = useCallback(
    (event) => {
      const { name, value, type, checked } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value ? "" : prevErrors[name],
      }));
    },
    [formData]
  );

  const onBlurValidation = (event) => {
    const { name, value } = event.target;
    console.log("entered", name, value);
    let tempErrors = { ...errors };
    if (name === "hoursWorked") {
      if (value === "hh:mm") {
        tempErrors.hoursWorked = "Worked hours is mandatory.";
      } else if (
        parseFloat(value.split(":").join(".")) >
        (employeeData?.workType !== "permanent" ? 8.0 : 12.0)
      ) {
        tempErrors.hoursWorked = `Worked Hours must be less than ${
          employeeData?.workType !== "permanent" ? 8 : 12
        } hours.`;
      }
    }
    setErrors(tempErrors);
  };

  const handleSubmit = useCallback(async () => {
    console.log(formData.taskDate);

    try {
      if (validate()) {
        const payload = {
          attendanceId: formData.attendanceId || 0,
          projectCode: formData.project,
          comments: formData.description,
          taskDate: dayjs(formData.taskDate).isValid()
            ? dayjs(formData.taskDate).format("YYYY-MM-DD")
            : formData.taskDate,
          empBasicDetailId: employeeData?.employeeBasicDetailId,
          timeInvested: dayjs(formData.hoursWorked).isValid()
            ? dayjs(formData.hoursWorked).format("HH:mm")
            : formData.hoursWorked,
          taskName: formData.task,
          location: formData.location,
          createdBy: employeeData?.emailId,
          isBillable: formData.isBillable,
        };
        await CreateOrUpdateTimesheet(payload)
          .then((res) => {
            if (!res) {
              Toaster("error", "Error creating or updating timesheet");
              return;
            }
            getTimesheetDetails();
            setResetSelection(true);
            resetForm();
            Toaster("success", "Timesheet Entry Saved.");
          })
          .catch((err) => {
            Toaster("error", err?.response?.data?.message);
          });
      } else {
        Toaster("error", "Please fill the mandatory fields.");
      }
    } catch (error) {
      console.log(error);
      Toaster("error", "Failed to submit timesheet");
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const getTimesheetDetails = useCallback(() => {
    SerchAttendanceDetails({
      empBasicDetailId: employeeData?.employeeBasicDetailId,
      status: ["100"],
      size: rowsPerPage || 5,
      page: page || 0,
    })
      .then((response) => {
        if (response?.data?.content?.length) {
          response.data.content.forEach((element) => {
            element["project"] = element.projectCode;
            element["task"] = element.taskName;
            element["hoursWorked"] = element.timeInvested;
            element["description"] = element.comments;
          });
          setData(response.data.content);
          setTotalCount(response.data.totalElements);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        Toaster("error", "Failed to fetch Timesheet Details.");
      });
  }, [data, page, rowsPerPage]);

  const sendForApproval = () => {
    if (!selectedTimeSheet.length) {
      Toaster(
        "warning",
        "Please select the entries using the checkboxes to submit them for approval."
      );
      return;
    }
    SendForApprovalAndApprove({
      attendanceEmpIdModels: data
        .filter((d, i) => selectedTimeSheet.includes(i))
        .map((d) => ({
          attendanceId: d.attendanceId,
          status: "101",
        })),
      basicEmpDetailId: employeeData?.employeeBasicDetailId,
    })
      .then((response) => {
        if (response) {
          Toaster("success", "Timesheet is successfully submitted");
          getTimesheetDetails();
          setResetSelection(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchData = useCallback(() => {
    axios
      .all([
        GetAllProjects(),
        GetAllTasks(),
        GetEmployeeProjects(employeeData?.employeeBasicDetailId),
        GetAllWorkLocation(),
      ])
      .then(
        axios.spread((projects, tasks, employeeProjects, allWorkLocations) => {
          setAllProjects(projects);
          setAllTasks(tasks);
          setEmployeeProjects(
            projects.filter((a) =>
              employeeProjects.some(
                (data) => data.projectCode === a.projectCode
              )
            )
          );
          employeeProjects = employeeProjects.filter((a) => {
            const taskDate = dayjs(formData.taskDate);
            const startDate = dayjs(a.allocationStartDate, "YYYY-MM-DD");
            const endDate = dayjs(a.allocationEndDate, "YYYY-MM-DD");
            const isDateInRange =
              (taskDate.isAfter(startDate, "date") &&
                taskDate.isBefore(endDate, "date")) ||
              taskDate.isSame(startDate, "date") ||
              taskDate.isSame(endDate, "date");
            return isDateInRange;
          });
          if (employeeProjects?.length) {
            projects = projects.map((a) => ({
              ...a,
              tasks: employeeProjects.find(
                (data) => data.projectCode === a.projectCode
              )?.tasks,
            }));
            setProjectData(
              projects.filter((a) => {
                const taskDate = dayjs(formData.taskDate);
                const startDate = dayjs(a.startDate, "YYYY-MM-DD");
                const endDate = dayjs(a.endDate, "YYYY-MM-DD");

                const isDateInRange =
                  (taskDate.isAfter(startDate, "date") &&
                    taskDate.isBefore(endDate, "date")) ||
                  taskDate.isSame(startDate, "date") ||
                  taskDate.isSame(endDate, "date");

                return (
                  isDateInRange &&
                  employeeProjects.some(
                    (data) => data.projectCode === a.projectCode
                  )
                );
              })
            );
            setTaskData(tasks);
            if (!formData.attendanceId) {
              defaultFormData.location = allWorkLocations.find(
                (a) => a.workLocationCode === employeeData?.workLocationCode
              )?.workLocation;
              if (employeeData?.workType !== "permanent") {
                defaultFormData.isBillable = true;
              }
              setFormData((prev) => ({
                ...prev,
                workLocationCode: defaultFormData.location,
                isBillable: defaultFormData.isBillable,
              }));
            }
          } else {
            Toaster(
              "error",
              "Kindly reach out to HR to allocate the project on the task date."
            );
          }
        })
      )
      .catch((error) => {
        console.log(error);
      });
  }, [
    employeeData?.employeeBasicDetailId,
    employeeData?.workLocationCode,
    employeeData?.workType,
    formData.attendanceId,
    formData.taskDate,
  ]);

  const sendDateApprovalForWeekend = () => {
    const payload = {
      employeeId: employeeData?.employeeBasicDetailId,
      taskDate: dayjs(formData.taskDate).format("YYYY-MM-DD"),
      status: "101",
    };
    SaveAndApproveWeekend(payload)
      .then((res) => {
        if (res) {
          Toaster("success", "Request sent successfully");
          setTabsValue(1);
        }
      })
      .catch((_err) => {
        Toaster("error", "Failed to send request");
      });
  };
  const weekendDateCheck = useCallback(
    async (taskdate, attendanceId) => {
      if (employeeData?.workType === "permanent" || attendanceId) {
        return true;
      }
      if (dayjs(taskdate).day() === 0 || dayjs(taskdate).day() === 6) {
        try {
          let response = await WeekendDateCheck({
            empBasicDetailId: employeeData?.employeeBasicDetailId,
            taskDate: dayjs(taskdate).format("YYYY-MM-DD"),
          });
          if (!response) {
            Toaster("warning", "Weekend date is not allowed.");
            setContentDialog(true);
            return false;
          } else if (response?.status === "101") {
            Toaster("warning", "Weekend date is submitted for approval.");
          } else if (response?.status === "103") {
            Toaster(
              "warning",
              "Weekend date is rejected.Please contact your reporting manager."
            );
          } else if (response?.status === "102") {
            return true;
          }
          setFormData(defaultFormData);
          return false;
        } catch (error) {
          Toaster("error", "Failed to check weekend date");
          setFormData(defaultFormData);
          console.log(error);
        }
      }
      return true;
    },
    [employeeData?.employeeBasicDetailId, employeeData?.workType]
  );
  useEffect(() => {
    setHeaders([
      "Task Date",
      "Project",
      "Task",
      "Worked Hours",
      "Billable",
      "Actions",
    ]);
    if (weekendDateCheck(formData.taskDate, formData.attendanceId)) {
      fetchData();
    }
  }, [fetchData, formData.attendanceId, formData.taskDate, weekendDateCheck]);

  useEffect(() => {
    getTimesheetDetails();
  }, [page, rowsPerPage]);

  const editData = useCallback(
    (data) => {
      console.log(data);

      resetForm();
      setFormData(data);
      setErrors(defaultErrors);
      setDisableForm(false);
    },
    [resetForm]
  );

  const viewData = useCallback((data) => {
    setFormData(data);
    setDisableForm(true);
  }, []);

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
        .catch((error) => console.log(error));
    },
    [employeeData?.employeeBasicDetailId, getTimesheetDetails]
  );

  const actionClick = useCallback(
    (event, item) => {
      switch (event) {
        case "edit":
          editData(item);
          break;
        case "delete":
          deleteData(item);
          break;
        case "view":
          viewData(item);
          break;
        default:
          break;
      }
    },
    [editData, deleteData, viewData]
  );

  const tabsChange = (event, value) => {
    if (value === 0) {
      setFormData(defaultFormData);
      fetchData();
    }
    setTabsValue(value);
  };

  const onRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const onPageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const TimesheetEntry = () => {
    return (
      <>
        <ConfigureForm
          data={configureFormData(formData)}
          buttonTitle="Add"
          handleChange={handleChange}
          submitClicked={handleSubmit}
          resetButton={resetForm}
          formDisabled={disableForm}
          onBlur={onBlurValidation}
        />
        <ConfigTable
          data={contentConfig(data)}
          headers={headers}
          actions={actionClick}
          selectionTable={true}
          onSelectedRowsChange={(data) => {
            setSelectedTimeSheet(data);
          }}
          pagination={true}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          totalCount={totalCount}
          resetSelection={resetSelection}
        />
        <Grid container justifyContent="flex-end" padding={1} spacing={1}>
          <Grid item>
            <Button
              type="button"
              size="small"
              variant="contained"
              color="rgb(77,208,225)"
              onClick={() => {
                sendForApproval();
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ px: 2 }}>
          <Typography variant="h6">Previous Entries</Typography>
        </Box>
        <ConfigTable
          data={contentPrevDataConfig(prevData)}
          headers={[
            "Task Date",
            "Project",
            "Task",
            "Worked Hours",
            "Billable",
            "Status",
          ]}
        />
      </>
    );
  };

  const TimesheetSummary = () => {
    return <TimeSheetSummary projects={employeeProjects} tasks={allTasks} />;
  };

  const timesheetReport = () => {
    return <TimesheetReport />;
  };

  const TimesheetApprovals = () => {
    return <TimeSheetApproval projectData={allProjects} taskData={allTasks} />;
  };

  const tabContainer = () => {
    switch (tabsValue) {
      case 0:
        return TimesheetEntry();
      case 1:
        return TimesheetSummary();
      case 2:
        return TimesheetApprovals();
      case 3:
        return timesheetReport();
      default:
        return null;
    }
  };

  useEffect(() => {
    if (employeeData?.genericProfile) {
      setTabsValue(3);
    }
  }, [employeeData?.genericProfile]);

  useEffect(() => {
    SerchAttendanceDetails({
      empBasicDetailId: employeeData?.employeeBasicDetailId,
      taskDate: dayjs(formData?.taskDate).isValid
        ? dayjs(formData?.taskDate)?.format("YYYY-MM-DD")
        : formData?.taskDate,
      page: 0,
      size: 20,
    }).then((a) => {
      setPrevData(a?.data?.content);
    });
  }, [employeeData?.employeeBasicDetailId, formData?.taskDate]);

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
        {UserManagentCheck("hr_tools_nems_timesheet_timesheetApply") &&
          !employeeData?.genericProfile && (
            <Tab label="Timesheet Entry" value={0} />
          )}
        {UserManagentCheck("hr_tools_nems_timesheet_summary") &&
          !employeeData?.genericProfile && (
            <Tab label="Timesheet Summary" value={1} />
          )}
        {UserManagentCheck("hr_tools_nems_timesheet_Approvals") &&
          !employeeData?.genericProfile && (
            <Tab label="Timesheet Approvals" value={2} />
          )}
        {UserManagentCheck("hr_tools_nems_timesheet_report") && (
          <Tab label="Timesheet Report" value={3} />
        )}
      </Tabs>
      <Box>{tabContainer()}</Box>
      <ContentDialog
        openDialog={contentDialog}
        handleCloseDialog={(result) => {
          setContentDialog(false);
          if (result) {
            sendDateApprovalForWeekend();
          } else {
            setFormData(defaultFormData);
          }
        }}
        title="Permission Required for Weekend Entry"
        content="You are attempting to enter a task on a weekend. To proceed, you must obtain approval from your reporting manager."
        okText="Send Request"
        cancelText="Cancel"
      />
    </Box>
  );
}

export default Timesheet;
