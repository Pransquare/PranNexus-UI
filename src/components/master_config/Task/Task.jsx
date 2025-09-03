import { Box } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import {
  CreateOrUpdateTask,
  DeleteTask,
  GetAllTasks,
} from "../../../service/api/TaskService";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Toaster } from "../../../common/alertComponets/Toaster";

const defaultForm = {
  taskCode: "",
  taskDescription: "",
  taskMasterId : "",
};

const defaultErrors = {
  taskCode: "",
  taskDescription: ""
};

function TaskMaster() {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [disableForm, setDisableForm] = useState(false);

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.taskCode.trim()) {
      tempErrors.taskCode = "Task ID is required.";
      isValid = false;
    }
    if (!formData.taskDescription.trim()) {
      tempErrors.taskDescription = "Task Description is required.";
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
              value: content.taskCode,
              isPrint: true,
            },
            {
              forAction: false,
              value: content.taskDescription,
              isPrint: true,
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
    [data] // Only depend on data
  );

  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Task Code",
          name: "taskCode",
          type: "text",
          value: formData.taskCode,
          error: errors.taskCode,
          required: true,
        },
        {
          label: "Task Description",
          name: "taskDescription",
          type: "text",
          value: formData.taskDescription,
          error: errors.taskDescription,
          required: true,
        },
      ];
    },
    [formData, errors] // Dependencies
  );

  const resetForm = useCallback(() => {
    setFormData(defaultForm);
    setErrors(defaultErrors);
    setDisableForm(false);
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

  const getAllTasks = useCallback(() => {
    GetAllTasks()
      .then((response) => {
        setData(response);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const deleteData = useCallback(
    (item) => {
      DeleteTask(item.taskMasterId) // Ensure the field name matches your data
        .then(() => {
          Toaster("success", "Task successfully deleted");
          getAllTasks();
        })
        .catch((error) => {
          Toaster("error", "Error deleting task");
          console.error(error);
        });
    },
    [getAllTasks]
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

  const handleSubmit = useCallback(() => {
    if (validate()) {
      const payload = {
        taskMasterId: formData.taskMasterId,
        taskCode: formData.taskCode, 
        taskDescription: formData.taskDescription,
      };

      CreateOrUpdateTask(payload) // Send the payload to the backend
        .then((response) => {
          Toaster("success", "Task successfully added");
          resetForm();
          getAllTasks(); // Fetch the updated list of tasks
        })
        .catch((error) => {
          Toaster("error", "Error adding task");
          console.error(error);
        });
    }
  }, [formData, validate, resetForm, getAllTasks]);

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  const headers = ["Task ID", "Task Description", "Action"]; // Direct definition

  return (
    <Box component="div" sx={{ ...panelStyle, padding: 1 }}>
      <ConfigureForm
        title="Task Configuration"
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

export default TaskMaster;
