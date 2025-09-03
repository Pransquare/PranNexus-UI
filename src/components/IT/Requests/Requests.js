import { Box } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import {
  CreateEmailAndRolesForUser,
  GetAllRoleType,
  GetEmployee,
} from "../../../service/api/itService/ItService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllDesignations } from "../../../service/api/DesinationService";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { register } from "../../../service/api/login/loginService";
const defaultForm = {
  employeeName: "",
  email: "",
  roleTypes: [],
};
const defaultErrors = {
  email: "",
  roleTypes: "",
};
function Requests() {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const { employeeData } = useContext(EmployeeDataContext);
  const [headers, setHeaders] = useState([]);
  const [buttonsHide, setButtonsHide] = useState({
    reset: true,
    save: false,
  });
  useEffect(() => {
    fetching();
  }, []);

  const fetching = () => {
    GetEmployee({
      employeeId: employeeData?.employeeBasicDetailId,
      page: 0,
      size: 1000,
    })
      .then(async (response) => {
        await GetAllDesignations()
          .then((data) => {
            setDesignations(data);
          })
          .catch();
        if (response && response.content && response.content.length) {
          setData(response.content);
        } else {
          setData([]);
        }
        GetAllRoleType()
          .then((data) => {
            setRoleTypes(data);
          })
          .catch();
      })
      .catch();
  };

  const contentConfig = useCallback(
    (input) => {
      return {
        actions: {
          edit: true,
          delete: false,
          view: false,
        },
        content: input.map((input) => {
          return [
            {
              forAction: false,
              isPrint: true,
              value: input?.jiraId || "N/A",
            },
            {
              forAction: false,
              isPrint: true,
              value: `${input?.firstName} ${input?.lastName}`,
            },
            {
              forAction: false,
              isPrint: true,
              value: input?.employeeCode,
            },
            {
              forAction: false,
              isPrint: true,
              value: designations?.find(
                (data) => data.designationCode === input?.designation
              )?.designationDescription,
            },

            {
              forAction: false,
              isPrint: true,
              value: input?.mobileNo,
            },

            {
              forAction: true,
              isPrint: false,
              value: input,
            },
          ];
        }),
      };
    },
    [data, designations]
  );
  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Employee Name",
          name: "employeeName",
          type: "text",
          value:
            formData?.employeeName || formData?.firstName
              ? `${formData?.firstName} ${formData?.lastName}`
              : "",
          disable: true,
          required: true,
        },
        {
          label: "Email ID",
          name: "email",
          type: "text",
          value: formData?.email,
          error: errors.email,
          required: true,
        },
        {
          label: "Role Types",
          name: "roleTypes",
          type: "multiSelect",
          value: formData?.roleTypes,
          options: roleTypes.map((data) => ({
            key: data.roleTypeCode,
            value: data.roleType,
          })),
          error: errors.roleTypes,
          required: true,
        },
      ];
    },
    [formData, errors, roleTypes]
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

  const resetForm = () => {
    setFormData(defaultForm);
    setErrors(defaultErrors);
  };

  const editData = useCallback((data) => {
    resetForm();
    setButtonsHide({
      reset: true,
      save: true,
    });
    setFormData({ ...data, roleTypes: ["EM"] });
    setErrors(defaultErrors);
  }, []);

  const actionClick = useCallback(
    (event, item) => {
      switch (event) {
        case "edit":
          editData(item);
          break;
      }
    },
    [editData]
  );

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.roleTypes?.length) {
      tempErrors.roleTypes = "Role Types is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = useCallback(async () => {
    if (validate()) {
      try {
        const registerPayload = {
          name: formData?.fullName,
          email: formData.email,
          createdBy: employeeData?.fullName,
          empCode: formData.employeeCode,
          roles: formData.roleTypes.map((role) => ({
            roleTypeCode: role,
          })),
        };
        await register(registerPayload);

        await CreateEmailAndRolesForUser({
          employeeCode: formData.employeeCode,
          email: formData.email,
          roles: formData.roleTypes.map((role) => ({
            roleTypeCode: role,
          })),
          token: localStorage.getItem("jwtToken"),
          createdBy: employeeData?.firstName + " " + employeeData?.lastName,
        });
        const response = await GetEmployee({
          employeeId: employeeData?.employeeBasicDetailId,
          page: 0,
          size: 1000,
        });
        if (response && response?.content && response?.content?.length) {
          Toaster(
            "success",
            "User registered & Email ID and Role types updated!"
          );
          setData(response?.content);
        } else {
          setData([]);
        }

        setButtonsHide({
          reset: true,
          save: false,
        });
        resetForm();
      } catch (error) {
        console.error("Error:", error);
        Toaster("error", error.response.data);
      }
    }
  }, [formData, data, contentConfig]);

  return (
    <Box sx={panelStyle}>
      <ConfigureForm
        data={configureFormData(formData)}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        buttonTitle="Update"
        buttonsHide={buttonsHide}
        resetButton={resetForm}
      />
      <ConfigTable
        data={contentConfig(data)}
        headers={[
          "Jira Ticket",
          "Employee Name",
          "Employee Code",
          "Designation",
          "Mobile Number",
          "Action",
        ]}
        actions={actionClick}
      />
    </Box>
  );
}

export default Requests;
