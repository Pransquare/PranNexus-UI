import { Tab, Tabs, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeesByName } from "../../../service/api/nemsService/EmployeeService";
import {
  GetEmployeeProjects,
  SaveOrUpdateEmployeeProjectsConfig,
} from "../../../service/api/hrConfig/hrConfig";
import { GetAllProjects } from "../../../service/api/ProjectService";
import { GetAllTasks } from "../../../service/api/nemsService/TaskService";

const defaultForm = {
  employee: "",
  projects: [],
};
function EmployeeProject() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState(defaultForm);
  const [employee, setEmployee] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [projects, setProjects] = useState();
  const [data, setData] = useState();
  const [allTasks, setAllTasks] = useState([]);
  const configForm = useCallback(
    (input) => {
      return [
        {
          name: "employee",
          label: "Employee Name",
          type: "suggestedDropdown",
          value: input?.employee,
          required: true,
          options:
            searchResults?.map((data) => {
              return {
                key: data.employeeCode,
                value: data.fullName,
                subValue: data.emailId,
              };
            }) || [],
        },
        {
          label: "Project",
          name: "projectCode",
          type: "dropDownList",
          value: input?.projectCode,
          options: projects?.map((data) => ({
            key: data.projectCode,
            value: `${data.projectCode} - ${data.projectName}`,
          })),
          required: true,
          additionalComponent: (
            <TextField
              label="Search Projects"
              variant="outlined"
              fullWidth
              value={formData?.searchProject || ""}
              onChange={handleSearchChange}
              margin="normal"
              size="small"
            />
          ),
        },
        {
          label: "Allocation Start Date",
          name: "allocationStartDate",
          type: "datePicker",
          value: input?.allocationStartDate
            ? dayjs(input?.allocationStartDate)
            : "",
          maxDate: input?.projectCode
            ? dayjs(
                projects.find((a) => a.projectCode === input?.projectCode)
                  ?.endDate,
                "YYYY-MM-DD"
              )
            : undefined,
          minDate: input?.projectCode
            ? dayjs(
                projects.find((a) => a.projectCode === input?.projectCode)
                  ?.startDate,
                "YYYY-MM-DD"
              )
            : undefined,
          required: true,
        },
        {
          label: "Allocation End Date",
          name: "allocationEndDate",
          type: "datePicker",
          value: input?.allocationEndDate
            ? dayjs(input?.allocationEndDate)
            : "",
          maxDate: input?.projectCode
            ? dayjs(
                projects.find((a) => a.projectCode === input?.projectCode)
                  ?.endDate,
                "YYYY-MM-DD"
              )
            : undefined,
          minDate: dayjs(input?.allocationStartDate),
          required: true,
        },
        {
          label: "Tasks",
          name: "tasks",
          type: "multiSelect",
          value: input?.tasks || [],
          options: allTasks?.map((data) => ({
            key: data.taskCode,
            value: data.taskDescription,
          })),
          required: true,
        },
      ];
    },
    [searchResults, projects, allTasks]
  );
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "employee") {
      const employeeBasicDetailId = searchResults?.find(
        (data) => data.fullName === value
      )?.employeeBasicDetailId;
      if (employeeBasicDetailId) {
        setEmployee(employeeBasicDetailId);
        setSearchResults([]);
        return;
      }
      if (value.length > 2) {
        setOptions(value);
      }
      setSearchResults([]);
      setEmployee(null);
      setFormData((prev) => ({ ...prev, projects: [] }));
    }
  };
  const handleSearchChange = (event) => {
    const { value } = event.target;
    // Update the formData to keep track of the search query
    setFormData((prevData) => ({ ...prevData, searchProject: value }));

    // Filter projects based on projectCode or projectName
    const filteredProjects = projects.filter(
      (project) =>
        project.projectCode.toLowerCase().includes(value.toLowerCase()) ||
        project.projectName.toLowerCase().includes(value.toLowerCase())
    );

    setProjects(filteredProjects);
  };

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => {
        setSearchResults(data);
      })
      .catch();
  }, []);

  const handleSubmit = () => {
    if (!employee) {
      Toaster("error", "Please configure employee to save");
      return;
    }
    if (!formData?.projectCode) {
      Toaster("error", "Please select project to save");
      return;
    }
    if (!formData?.allocationStartDate) {
      Toaster("error", "Please select allocation start date to save");
      return;
    }
    if (!formData?.allocationEndDate) {
      Toaster("error", "Please select allocation end date to save");
      return;
    }
    if (formData?.employeeProjectConfigId) {
      if (
        data.filter((a) => a.projectCode === formData?.projectCode).length > 1
      ) {
        Toaster("error", "Project already allocated to employee");
        return;
      }
    } else {
      if (data.find((a) => a.projectCode === formData?.projectCode)) {
        Toaster("error", "Project already allocated to employee");
        return;
      }
    }
    const payload = [
      {
        employeeProjectConfigId: formData?.employeeProjectConfigId,
        employeeId: employee,
        projectCode: formData?.projectCode,
        createdBy: formData?.createdBy || employeeData?.emailId,
        createdDate: formData?.createdDate || dayjs().format("YYYY-MM-DD"),
        modifiedBy: employeeData?.emailId,
        modifiedDate: dayjs().format("YYYY-MM-DD"),
        status: "108",
        allocationStartDate: dayjs(formData?.allocationStartDate).format(
          "YYYY-MM-DD"
        ),
        allocationEndDate: dayjs(formData?.allocationEndDate).format(
          "YYYY-MM-DD"
        ),
        tasks: formData?.tasks?.map((a) => ({
          taskCode: a,
        })),
      },
    ];
    SaveOrUpdateEmployeeProjectsConfig(payload)
      .then((res) => {
        if (res) {
          Toaster("success", "Projects saved successfully.");
          GetEmployeeProjects(employee).then((res) => {
            setData(
              res.map((a) => ({
                ...a,
                tasks: a?.tasks?.map((a) => a.taskCode),
              }))
            );
            setFormData((prev) => ({
              ...prev,
              employeeProjectConfigId: null,
              projectCode: "",
              allocationStartDate: "",
              allocationEndDate: "",
              tasks: [],
            }));
          });
        } else {
          Toaster("error", "Error saving projects.");
        }
      })
      .catch();
  };

  const configData = (a) => ({
    actions: {
      edit: true,
    },
    content: a?.map((b) => [
      {
        forAction: false,
        isPrint: true,
        value: b.projectCode,
      },
      {
        forAction: false,
        isPrint: true,
        value:
          projects?.find((project) => project.projectCode === b.projectCode)
            ?.projectName || "N/A",
      },
      {
        forAction: false,
        isPrint: true,
        value:
          projects?.find((project) => project.projectCode === b.projectCode)
            ?.clientName || "N/A",
      },

      {
        forAction: false,
        isPrint: true,
        value: b.allocationStartDate,
      },
      {
        forAction: false,
        isPrint: true,
        value: b.allocationEndDate,
      },
      {
        forAction: false,
        isPrint: true,
        value: b?.tasks
          ?.map(
            (curr) =>
              allTasks?.find((a) => a.taskCode === curr)?.taskDescription
          )
          .filter(Boolean) // Removes undefined values (if any)
          .join(", "), // Joins without adding an extra comma
      },
      {
        forAction: true,
        isPrint: false,
        value: { ...b },
      },
    ]),
  });

  const actionClick = (_event, item) => {
    setFormData((prev) => ({ ...item, employee: prev.employee }));
    setEmployee(item.employeeId);
  };

  const resetButton = () => {
    setFormData(null);
    setData([]);
    setEmployee(null);
    setSearchResults([]);
  };
  useEffect(() => {
    if (employee) {
      axios
        .all([GetAllProjects(), GetEmployeeProjects(employee), GetAllTasks()])
        .then(
          axios.spread((getallProjects, getEmployeeProjects, tasks) => {
            if (getallProjects) {
              setProjects(getallProjects);
            }
            if (getEmployeeProjects) {
              getEmployeeProjects = getEmployeeProjects.map((a) => ({
                ...a,
                tasks: a?.tasks?.map((a) => a.taskCode),
              }));
              setData(getEmployeeProjects);
            }
            if (tasks) {
              setAllTasks(tasks);
            }
          })
        )
        .catch();
    } else {
      resetButton();
    }
  }, [employee]);

  return (
    <Box sx={panelStyle}>
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px", // Decrease the font size
            minWidth: "50px", // Decrease the minimum width of each tab
            padding: "6px 12px", // Adjust the padding of each tab
          },
          "& .MuiTab-wrapper": {
            marginTop: "0", // Decrease the margin top of each tab
          },
        }}
        value={0}
      >
        <Tab label="Search" />
      </Tabs>
      <ConfigureForm
        data={configForm(formData)}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        resetButton={resetButton}
        buttonsHide={{
          reset: true,
          save: true,
        }}
      />
      <ConfigTable
        data={configData(data)}
        headers={[
          "Project Code",
          "Project Name",
          "Client",
          "Allocation Start Date",
          "Allocation End Date",
          "Tasks",
          "Action",
        ]}
        actions={actionClick}
      />
    </Box>
  );
}

export default EmployeeProject;
