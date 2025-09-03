import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  CreateOrUpdateLeaveType,
  DedupeCheckWithLeaveTypeCode,
  DeleteLeaveType,
  GetAllLeaveTypes,
} from "../../../service/api/LeaveTypeService";
import { validateAlphabets } from "../../../common/commonValidation/CommonValidation";

const defaultFormData = {
  leaveTypeId: "",
  leaveCode: "",
  isUnLimited: "",
  leaveDescription: "",
  creditFrequency: "",
  leaveCredit: "",
};

const defaultErrors = {
  leaveCode: "",
  leaveDescription: "",
  leaveCredit: "",
  creditFrequency: "",
};

const creditFreqList = [
  {
    key: "weekly",
    value: "Weekly",
  },
  {
    key: "monthly",
    value: "Monthly",
  },
  {
    key: "quarterly",
    value: "Quarterly",
  },
  {
    key: "halfyearly",
    value: "Half Yearly",
  },
];

function LeaveType() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.leaveCode) {
      tempErrors.leaveCode = "Leave Code is required.";
      isValid = false;
    } else if (
      data.content.some((item) => item.leaveCode === formData.leaveCode)
    ) {
      tempErrors.leaveCode = "Leave Code must be unique.";
      isValid = false;
    }

    if (!validateAlphabets(formData.leaveDescription)) {
      tempErrors.leaveDescription = "Invalid leave description.";
      isValid = false;
    }

    if (!formData.creditFrequency) {
      tempErrors.creditFrequency = "Credit Frequency is required";
      isValid = false;
    }
    if (!formData.leaveCredit) {
      tempErrors.leaveCredit = "Leave credit is required";
      isValid = false;
    }
    if (typeof formData.leaveCredit != Number) {
    }

    setErrors(tempErrors);
    return isValid;
  };

  const contentConfig = useCallback((content) => {
    return [
      { isPrint: true, forAction: false, value: content.leaveCode },
      {
        forAction: false,
        isPrint: true,
        value: content.leaveDescription,
      },
      {
        forAction: false,
        isPrint: true,
        value: content.isUnLimited ? "Yes" : "No",
      },
      {
        forAction: false,
        isPrint: true,
        value: creditFreqList.find((a) => a.key === content.creditFrequency)
          ?.value,
      },
      {
        forAction: false,
        isPrint: true,
        value: content.leaveCredit,
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
          label: "Leave Code",
          name: "leaveCode",
          type: "text",
          value: formData?.leaveCode,
          error: errors.leaveCode,
          required: true,
        },
        {
          label: "Leave Description",
          name: "leaveDescription",
          type: "text",
          value: formData?.leaveDescription,
          error: errors.leaveDescription,
          required: true,
        },
        {
          label: "Is Unlimited ?",
          name: "isUnLimited",
          type: "checkbox",
          value: formData?.isUnLimited,
        },
        {
          label: "Credit Frequency",
          name: "creditFrequency",
          type: "dropDownList",
          options: creditFreqList,
          value: formData?.creditFrequency,
          disable: formData?.isUnLimited,
        },
        {
          label: "Credit Leave Value",
          name: "leaveCredit",
          type: "dropDownList",
          options: [
            {
              key: 0.5,
              value: "0.5",
            },
            {
              key: 1.0,
              value: "1.0",
            },
            {
              key: 1.5,
              value: "1.5",
            },
            {
              key: 2.0,
              value: "2.0",
            },
            {
              key: 2.5,
              value: "2.5",
            },
            {
              key: 3.0,
              value: "3.0",
            },
            {
              key: 3.5,
              value: "3.5",
            },
            {
              key: 4.0,
              value: "4.0",
            },
          ],
          value: formData?.leaveCredit,
          disable: formData?.isUnLimited,
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
      if (!formData.leaveTypeId) {
        const res = await DedupeCheckWithLeaveTypeCode(formData.leaveCode);
        if (res) {
          Toaster("warning", "Leave code is already present");
          return;
        }
      }
      const payLoad = {
        leaveTypeId: formData.leaveTypeId || null,
        leaveTypeCode: formData.leaveCode || null,
        leaveTypeDescription: formData.leaveDescription || null,
        isUnlimited: formData.isUnLimited || false,
        creditFrequency: formData.creditFrequency || null,
        leaveCredit: formData.leaveCredit || null,
        createdBy: "mani",
        modifiedBy: "mani",
      };
      await CreateOrUpdateLeaveType(payLoad)
        .then(() => {
          getAllLeaveTypes();
          Toaster("success", "Leave type successfully added.");
        })
        .catch((error) => {
          Toaster("error", error?.response?.data?.message);
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
    getAllLeaveTypes();
    setHeaders([
      "Leave Code",
      "Leave Description",
      "Unlimited",
      "Credit Frequency",
      "Credit Leave Value",
      "Action",
    ]);
  }, []);

  const getAllLeaveTypes = () => {
    GetAllLeaveTypes()
      .then((response) => {
        setData({
          actions: {
            edit: true,
            delete: true,
            view: false,
          },
          content: response.map((content) => {
            return contentConfig({
              leaveTypeId: content.leaveTypeId,
              leaveCode: content.leaveTypeCode,
              leaveDescription: content.leaveTypeDescription,
              isUnLimited: content.unlimited,
              creditFrequency: content.creditFrequency,
              leaveCredit: content.leaveCredit,
            });
          }),
        });
      })
      .catch(() => {
        Toaster("error", "Failed to fetch leave types.");
      });
  };
  const editData = useCallback((data) => {
    resetForm();
    setFormData(data);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const deleteData = useCallback((item) => {
    DeleteLeaveType(item.leaveTypeId)
      .then(() => {
        Toaster("error", "Leave type was successfully deleted");
        getAllLeaveTypes();
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
        title="Leave Type Configuration"
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

export default LeaveType;
