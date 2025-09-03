import { Box } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import {
  CreateOrUpdateDesignation,
  DedupeCheckWithDesignationCode,
  DeleteDesignation,
  GetAllDesignations,
} from "../../../service/api/DesinationService";
import { validateAlphabets } from "../../../common/commonValidation/CommonValidation";

const defaultFormData = {
  designationId: "",
  designationCode: "",
  designation: "",
};

const defaultErrors = {
  designationCode: "",
  designation: "",
};

function DesignationMaster() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);

  const validate = useCallback(() => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.designationCode.trim()) {
      tempErrors.designationCode = "Designation Code is required.";
      isValid = false;
    }
    if (!validateAlphabets(formData.designation)) {
      tempErrors.designation = "Invalid Designation.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  }, [formData]);

  const contentConfig = useCallback((content) => {
    return [
      { isPrint: true, forAction: false, value: content.designationCode },
      {
        forAction: false,
        isPrint: true,
        value: content.designation,
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
          label: "Designation Code",
          name: "designationCode",
          type: "text",
          value: formData?.designationCode,
          error: errors.designationCode,
          required: true,
        },
        {
          label: "Designation",
          name: "designation",
          type: "text",
          value: formData?.designation,
          error: errors.designation,
          required: true,
        },
      ];
    },
    [errors]
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

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const getAllDesignations = useCallback(() => {
    GetAllDesignations()
      .then((response) => {
        setData({
          actions: {
            edit: true,
            delete: true,
            view: false,
          },
          content: response.map((content) => {
            return contentConfig({
              designationId: content.designationMasterId,
              designationCode: content.designationCode,
              designation: content.designationDescription,
            });
          }),
        });
      })
      .catch(() => {
        Toaster("error", "Failed to fetch Designations.");
      });
  }, [contentConfig]);

  const handleSubmit = useCallback(async () => {
    if (validate()) {
      if (!formData.designationId) {
        const res = await DedupeCheckWithDesignationCode(
          formData.designationCode
        );
        if (res) {
          Toaster("warning", "Designation code is already present");
          return;
        }
      }
      const payLoad = {
        designationMasterId: formData.designationId || null,
        designationCode: formData.designationCode || null,
        designationDescription: formData.designation || null,
        user: "mani",
      };
      await CreateOrUpdateDesignation(payLoad)
        .then(() => {
          getAllDesignations();
          Toaster("success", "Designation successfully added.");
        })
        .catch((error) => {
          Toaster("error", error?.response?.data?.message);
        });
      resetForm();
    } else {
      Toaster("error", "Please enter a valid content");
    }
  }, [formData, validate, getAllDesignations, resetForm]);

  useEffect(() => {
    getAllDesignations();
    setHeaders(["Designation Code", "Designation", "Action"]);
  }, [getAllDesignations]);

  const editData = useCallback(
    (data) => {
      resetForm();
      setFormData(data);
      setErrors(defaultErrors);
      setDisableForm(false);
    },
    [resetForm]
  );

  const deleteData = useCallback(
    (item) => {
      DeleteDesignation(item.designationId)
        .then(() => {
          Toaster("success", "Leave type was successfully deleted");
          getAllDesignations();
        })
        .catch();
    },
    [getAllDesignations]
  );

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
        title="Designation Configuration"
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

export default DesignationMaster;
