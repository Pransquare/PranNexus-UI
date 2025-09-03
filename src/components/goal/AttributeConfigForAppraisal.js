import React, { useEffect, useState, useCallback, useContext } from "react";
import { Box } from "@mui/material";
import { validateAlphabets } from "../../common/commonValidation/CommonValidation";
import { Toaster } from "../../common/alertComponets/Toaster";
import { panelStyle } from "../../common/customStyles/CustomStyles";
import ConfigureForm from "../../common/customComponents/ConfigureForm";
import ConfigTable from "../../common/customComponents/ConfigTable";
import {
  saveOrUpdateAttributes,
  searchAttributes,
} from "../../service/api/emsService/GoalService";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const defaultFormData = {
  attributeConfigId: 0,
  attributeName: "",
};

const defaultErrors = {
  attributeName: "",
};

function AttributeConfigForAppraisal() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers] = useState(["S.No", "Attribute Name", "Status", "Action"]);
  const [disableForm, setDisableForm] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 100,
    totalPages: 0,
  });
  const { employeeData } = useContext(EmployeeDataContext);

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.attributeName.trim()) {
      tempErrors.attributeName = "Attribute Name is required.";
      isValid = false;
    } else if (!validateAlphabets(formData.attributeName)) {
      tempErrors.attributeName = "Only alphabets are allowed.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const contentConfig = useCallback(
    (input) => {
      return {
        actions: { edit: true, delete: true, view: true },
        content: input.map((item, index) => [
          {
            isPrint: true,
            forAction: false,
            value: pageInfo.page * pageInfo.size + index + 1,
          },
          { isPrint: true, forAction: false, value: item.attributeName },
          { isPrint: true, forAction: false, value: item.status },
          {
            forAction: true,
            isPrint: false,
            value: { ...item, attributeConfigId: item.attributeConfigId || 0 },
          },
        ]),
      };
    },
    [pageInfo]
  );

  const configureFormData = useCallback(
    (formData) => [
      {
        label: "Attribute Name",
        name: "attributeName",
        type: "text",
        value: formData.attributeName,
        error: errors.attributeName,
        required: true,
      },
    ],
    [formData, errors]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      Toaster("error", "Please enter a valid attribute name");
      return;
    }

    const payload = {
      attributeConfigId: formData.attributeConfigId || 0,
      attributeName: formData.attributeName.trim(),
      status: "Active",
      createdBy: employeeData?.emailId,
    };

    await saveOrUpdateAttributes(payload)
      .then(() => {
        Toaster("success", "Attribute saved successfully.");
        getAllAttributes(pageInfo.page);
      })
      .catch(() => Toaster("error", "Failed to save attribute."));

    resetForm();
  }, [formData, employeeData, pageInfo.page]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const getAllAttributes = useCallback(
    (page = 0) => {
      const payload = {
        attributeName: "",
        status: "Active",
        page: page,
        size: pageInfo.size,
      };
      searchAttributes(payload)
        .then((res) => {
          setData(res.content || []);
          setPageInfo({
            page: res.number,
            size: res.size,
            totalPages: res.totalPages,
          });
        })
        .catch(() => Toaster("error", "Failed to fetch attributes."));
    },
    [pageInfo.size]
  );

  useEffect(() => {
    getAllAttributes();
  }, [getAllAttributes]);

  const editData = useCallback(
    (item) => {
      resetForm();
      setFormData({
        attributeConfigId: item.attributeConfigId,
        attributeName: item.attributeName,
      });
      setDisableForm(false);
    },
    [resetForm]
  );

  const viewData = useCallback((item) => {
    setFormData({
      attributeConfigId: item.attributeConfigId,
      attributeName: item.attributeName,
    });
    setDisableForm(true);
  }, []);

  const deleteData = useCallback(
    async (item) => {
      const payload = {
        attributeConfigId: item.attributeConfigId,
        attributeName: item.attributeName,
        status: "Deleted",
        createdBy: employeeData?.emailId,
      };

      await saveOrUpdateAttributes(payload)
        .then(() => {
          Toaster("success", "Attribute deleted successfully.");
          getAllAttributes(pageInfo.page);
        })
        .catch(() => Toaster("error", "Failed to delete attribute."));
    },
    [employeeData, getAllAttributes, pageInfo.page]
  );

  const actionClick = useCallback(
    (event, item) => {
      switch (event) {
        case "edit":
          editData(item);
          break;
        case "view":
          viewData(item);
          break;
        case "delete":
          deleteData(item);
          break;
        default:
          break;
      }
    },
    [editData, viewData, deleteData]
  );

  const handlePageChange = useCallback(
    (event, newPage) => {
      getAllAttributes(newPage);
    },
    [getAllAttributes]
  );

  return (
    <Box component="div" sx={{ ...panelStyle, padding: 1 }}>
      <ConfigureForm
        title="Appraisal Attribute Configuration"
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
        page={pageInfo.page}
        totalPages={pageInfo.totalPages}
        rowsPerPage={pageInfo.size}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}

export default AttributeConfigForAppraisal;
