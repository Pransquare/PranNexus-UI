import { Box } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { panelStyle } from "../../../common/customStyles/CustomStyles";

const defaultForm = {
  roleType: "",
};
const defaultErrors = {
  roleType: "",
};
function RoleTypes() {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {}, []);

  const contentConfig = useCallback((input) => {
    return {
      actions: {
        edit: true,
        delete: true,
        view: true,
      },
      content: [],
    };
  }, []);
  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Role Type",
          name: "roleType",
          type: "text",
          value: formData?.roleType,
          error: errors.roleType,
        },
      ];
    },
    [formData, errors]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : prev[name],
    }));
  });

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.roleType) {
      tempErrors.roleType = "Role Type is required.";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  return (
    <Box sx={panelStyle}>
      <ConfigureForm
        data={configureFormData(formData)}
        title="Role Type Configuration"
        handleChange={handleChange}
      />
      <ConfigTable
        data={contentConfig(data)}
        headers={["Role Type", "Action"]}
      />
    </Box>
  );
}

export default RoleTypes;
