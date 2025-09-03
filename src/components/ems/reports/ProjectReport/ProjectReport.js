import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserManagentCheck } from "../../../../common/UserManagement";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";
import { EmployeeDataContext } from "../../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllProjects } from "../../../../service/api/ProjectService";
import { GenerateProjectReport } from "../../../../service/api/emsService/TimeSheetService";
import { GetEmployeeProjects } from "../../../../service/api/hrConfig/hrConfig";

function ProjectReport() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [projects, setProjects] = useState();
  const [clients, setClients] = useState();
  const [formData, setFormData] = useState({
    client: "",
    project: [],
    startDate: "",
    endDate: "",
  });
  const hr_tools_ems_management_project_report = UserManagentCheck(
    "hr_tools_ems_management_project_report"
  );

  const configureFormData = useCallback(
    (input) => {
      return [
        {
          label: "Client",
          name: "client",
          type: "dropDownList",
          value: input?.client,
          options: [
            ...new Map(
              clients?.map((data) => [
                data.clientCode,
                { key: data.clientCode, value: data.clientName },
              ])
            ).values(),
          ],
          required: false, // changed to optional
        },
        {
          label: "Project",
          name: "project",
          type: "multiSelect",
          value: input?.project,
          options: projects?.map((data) => ({
            key: data.projectCode,
            value: data.projectName,
          })),
        },
        {
          label: "Start Date",
          name: "startDate",
          type: "date",
          value: input?.startDate,
          required: true,
        },
        {
          label: "End Date",
          name: "endDate",
          type: "date",
          value: input?.endDate,
          required: true,
        },
      ];
    },
    [projects, clients]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "client") {
      setFormData((prevData) => ({ ...prevData, project: "" }));
      setProjects(clients?.filter((a) => a.clientCode === value));
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetButton = () => {
    setFormData({
      client: "",
      project: [],
      startDate: "",
      endDate: "",
    });
  };

  const submitClicked = () => {
    if (!formData?.startDate || !formData?.endDate) {
      Toaster("error", "Please select both start and end dates.");
      return;
    }

    const payload = {
      clientCode: formData.client || null,
      projectCode: formData.project.length
        ? formData.project
        : projects?.map((a) => a.projectCode),
      fromDate: formData.startDate,
      toDate: formData.endDate,
      emailId:employeeData?.emailId
    };

    GenerateProjectReport(payload)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ProjectReport.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((_e) => {
        Toaster("error", "Something went wrong.");
      });
  };

  useEffect(() => {
    axios
      .all([
        GetAllProjects(),
        GetEmployeeProjects(employeeData?.employeeBasicDetailId),
      ])
      .then(
        axios.spread((getallProjects, getEmployeeProjects) => {
          if (getallProjects && getEmployeeProjects) {
            const projectDetails = hr_tools_ems_management_project_report
              ? getallProjects
              : getallProjects.filter((a) =>
                  getEmployeeProjects.some(
                    (b) => b.projectCode === a.projectCode
                  )
                );
            setClients(projectDetails);
          }
        })
      )
      .catch((error) => console.log(error));
  }, [employeeData, hr_tools_ems_management_project_report]);

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

export default ProjectReport;
