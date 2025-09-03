import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  CreateOrUpdateProject,
  DedupeCheckWithProjectCode,
  DeleteProject,
  GetAllProjects,
} from "../../../service/api/ProjectService";
import { GetAllClients } from "../../../service/api/ClientService";
import dayjs from "dayjs";
import {
  validateAlphabets,
  validateAlphaNumericWithDotDash,
} from "../../../common/commonValidation/CommonValidation";

const defaultFormData = {
  projectId: "",
  projectCode: "",
  projectName: "",
  clientCode: "",
  location: "",
  startDate: "",
  endDate: "",
};

const defaultErrors = {
  projectCode: "",
  projectName: "",
  clientCode: "",
  location: "",
  startDate: "",
  endDate: "",
};

function ProjectMaster() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [clientData, setClientData] = useState([]);

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.projectCode.trim()) {
      tempErrors.projectCode = "Project Code is required.";
      isValid = false;
    }

    if (!formData.projectName.trim()) {
      tempErrors.projectName = "Project Name is required.";
      isValid = false;
    } else if (!validateAlphaNumericWithDotDash(formData.projectName)) {
      tempErrors.projectName =
        "Only letters, numbers, spaces, dot (.) and dash (-) are allowed.";
      isValid = false;
    }

    if (!formData.clientCode.trim()) {
      tempErrors.clientCode = "Client Code is required.";
      isValid = false;
    }

    if (!validateAlphabets(formData.location)) {
      tempErrors.location = "Location is required.";
      isValid = false;
    }
    if (!formData.startDate) {
      tempErrors.location = "Project start date is required.";
      isValid = false;
    }

    if (!formData.endDate) {
      tempErrors.endDate = "Project end date is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

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
              forAction: false,
              isPrint: true,
              value: clientData.find(
                (data) => data.clientCode === content.clientCode
              )?.clientName,
            },
            { isPrint: true, forAction: false, value: content.projectCode },
            {
              forAction: false,
              isPrint: true,
              value: content.projectName,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.location,
            },
            {
              forAction: false,
              isPrint: true,
              value: dayjs(content.startDate).format("DD/MM/YYYY"),
            },
            {
              forAction: false,
              isPrint: true,
              value: dayjs(content.endDate).format("DD/MM/YYYY"),
            },
            {
              forAction: true,
              isPrint: false,
              value: { ...content, projectId: content.projectMasterId || null },
            },
          ];
        }),
      };
    },
    [clientData, data]
  );

  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Client Name",
          name: "clientCode",
          type: "dropDownList",
          value: formData.clientCode,
          options: clientData.map((client) => ({
            key: client.clientCode,
            value: client.clientName,
          })),
          error: errors.clientCode,
          required: true,
        },
        {
          label: "Project Code",
          name: "projectCode",
          type: "text",
          value: formData.projectCode,
          error: errors.projectCode,
          required: true,
        },
        {
          label: "Project Name",
          name: "projectName",
          type: "text",
          value: formData.projectName,
          error: errors.projectName,
          required: true,
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
          label: "Start Date",
          name: "startDate",
          type: "datePicker",
          value: dayjs(formData.startDate),
          error: errors.startDate,
          required: true,
        },
        {
          label: "End Date",
          name: "endDate",
          type: "datePicker",
          value: dayjs(formData.endDate),
          error: errors.endDate,
          minDate: dayjs(formData.startDate),
          required: true,
        },
      ];
    },
    [formData, errors, clientData]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: typeof value === "string" ? value.trim() : value,
    }));

    // Clear the error message for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (validate()) {
      if (!formData.projectId) {
        try {
          const res = await DedupeCheckWithProjectCode(formData.projectCode);
          if (res) {
            Toaster("warning", "Project code is already present");
            return;
          }
        } catch (err) {
          console.log(err);
        }
      }
      const payLoad = {
        ...formData,
        projectId: formData.projectId || null,
        startDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
        user: "mani",
      };
      await CreateOrUpdateProject(payLoad)
        .then(() => {
          getAllProjects();
          Toaster("success", "Project successfully added.");
        })
        .catch(() => {
          Toaster("error", "Failed to add Client.");
        });
      resetForm();
    } else {
      Toaster("error", "Please enter a valid content");
    }
  }, [formData, data, contentConfig]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const getAllProjects = useCallback(() => {
    GetAllProjects()
      .then((response) => {
        setData(response);
      })
      .catch(() => {
        Toaster("error", "Failed to fetch Projects.");
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await GetAllClients();
        setClientData(
          clients.map((client) => ({
            clientCode: client.clientCode,
            clientName: client.clientName,
          }))
        );
        getAllProjects();
      } catch (error) {
        Toaster("error", "Failed to fetch Clients or Projects.");
      }
    };

    fetchData();
    setHeaders([
      "Client Name",
      "Project Code",
      "Project Name",
      "Location",
      "Start Date",
      "End Date",
      "Action",
    ]);
  }, []);

  const editData = useCallback(
    (data) => {
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
      DeleteProject(item.projectId)
        .then(() => {
          Toaster("success", "Project successfully deleted");
          getAllProjects();
        })
        .catch();
    },
    [getAllProjects]
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

  return (
    <Box component="div" sx={{ ...panelStyle, padding: 1 }}>
      <ConfigureForm
        title="Project Configuration"
        data={configureFormData(formData)}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        resetButton={resetForm}
        formDisabled={disableForm}
      />
      <ConfigTable
        data={contentConfig(data)}
        headers={headers}
        actions={actionClick}
      />
    </Box>
  );
}

export default ProjectMaster;
