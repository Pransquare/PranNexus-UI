import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  CreateOrUpdateDepartment,
  DedupeCheckWithDepartmentCode,
  DeleteDepartment,
  GetAllDepartments,
} from "../../../service/api/DepartmentService";

const defaultFormData = {
  departmentMasterId: "",
  departmentCode: "",
  departmentDescription: "",
};

const defaultErrors = {
  departmentCode: "",
  departmentDescription: "",
};

function DepartmentMaster() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.departmentCode) {
      tempErrors.departmentCode = "Department Code is required.";
      isValid = false;
    }

    if (!formData.departmentDescription) {
      tempErrors.departmentDescription = "Department Description is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const contentConfig = useCallback((content) => {
    return [
      { isPrint: true, forAction: false, value: content.departmentCode },
      {
        forAction: false,
        isPrint: true,
        value: content.departmentDescription,
      },
      {
        forAction: true,
        isPrint: false,
        value: content,
      },
    ];
  }, []);

  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Department Code",
          name: "departmentCode",
          type: "text",
          value: formData?.departmentCode,
          error: errors.departmentCode,
        },
        {
          label: "Department Description",
          name: "departmentDescription",
          type: "text",
          value: formData?.departmentDescription,
          error: errors.departmentDescription,
        },
      ];
    },
    [formData, errors]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    // Clear the error message for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (validate()) {
      if (!formData.departmentMasterId) {
        const res = await DedupeCheckWithDepartmentCode(
          formData.departmentCode
        );
        if (res) {
          Toaster("warning", "Department code is already present");
          return;
        }
      }

      const payLoad = {
        ...formData,
        departmentMasterId: formData.departmentMaster || null,
        user: "mani",
      };

      await CreateOrUpdateDepartment(payLoad)
        .then(() => {
          getAllDepartments();
          Toaster("success", "Department successfully added.");
        })
        .catch(() => {
          Toaster("error", "Failed to add department.");
        });

      resetForm();
    } else {
      Toaster("error", "Please enter a valid content");
    }
  }, [formData, contentConfig]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  useEffect(() => {
    getAllDepartments();
    setHeaders(["Department Code", "Department Description", "Action"]);
  }, []);

  const getAllDepartments = () => {
    GetAllDepartments()
      .then((response) => {
        setData({
          actions: {
            edit: true,
            delete: true,
            view: false,
          },
          content: response.map((content) => {
            return contentConfig({
              departmentMasterId: content.departmentMasterId,
              departmentCode: content.departmentCode,
              departmentDescription: content.departmentDescription,
            });
          }),
        });
      })
      .catch(() => {
        Toaster("error", "Failed to fetch departments.");
      });
  };

  const editData = useCallback((data) => {
    resetForm();
    setFormData(data);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const deleteData = useCallback((item) => {
    DeleteDepartment(item.departmentMasterId)
      .then(() => {
        Toaster("success", "Department was successfully deleted");
        getAllDepartments();
      })
      .catch();
  }, []);

  const actionClick = useCallback(
    (event, item, index) => {
      switch (event) {
        case "edit":
          editData(item);
          break;
        case "delete":
          deleteData(item);
          break;
        default:
          break;
      }
    },
    [editData, deleteData]
  );

  return (
    <Box component="div" sx={{ ...panelStyle, padding: 1 }}>
      <ConfigureForm
        title="Department Configuration"
        data={configureFormData(formData)}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        resetButton={resetForm}
        formDisabled={disableForm}
      />
      <ConfigTable data={data} headers={headers} actions={actionClick} />
    </Box>
  );
}

export default DepartmentMaster;
