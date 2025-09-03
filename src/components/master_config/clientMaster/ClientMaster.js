import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  CreateOrUpdateClient,
  DedupeClient,
  DeleteClient,
  GetAllClients,
} from "../../../service/api/ClientService";
import {
  validateAlphabets,
  validateAlphaNumericWithDotDash,
  validatePostalCode,
} from "../../../common/commonValidation/CommonValidation";

const defaultFormData = {
  clientId: "",
  clientCode: "",
  clientName: "",
  address1: "",
  address2: "",
  address3: "",
  postalCode: "",
  country: "",
  state: "",
};

const defaultErrors = {
  clientCode: "",
  clientName: "",
  address1: "",
  postalCode: "",
  country: "",
  state: "",
};

function ClientMaster() {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);

  const validate = useCallback(() => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.clientCode.trim()) {
      tempErrors.clientCode = "Client Code is required.";
      isValid = false;
    }
    if (!formData.clientName.trim()) {
      tempErrors.clientName = "Client Name is required.";
      isValid = false;
    } else if (!validateAlphaNumericWithDotDash(formData.clientName)) {
      tempErrors.clientName =
        "Only letters, numbers, spaces, dot (.) and dash (-) are allowed.";
      isValid = false;
    }

    if (!formData.address1.trim()) {
      tempErrors.address1 = "Address 1 is required.";
      isValid = false;
    }
    if (!validatePostalCode(formData.postalCode)) {
      tempErrors.postalCode = "Invalid Postal Code.";
      isValid = false;
    }
    if (!validateAlphabets(formData.country)) {
      tempErrors.country = "Invalid Country format.";
      isValid = false;
    }
    if (!validateAlphabets(formData.state)) {
      tempErrors.state = "Invalid State format.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setDisableForm(false);
  }, []);

  const contentConfig = useCallback((content) => {
    return [
      { isPrint: true, forAction: false, value: content.clientCode },
      {
        forAction: false,
        isPrint: true,
        value: content.clientName,
      },
      {
        forAction: false,
        isPrint: true,
        value: content.country,
      },
      {
        forAction: false,
        isPrint: true,
        value: content.state,
      },
      {
        forAction: false,
        isPrint: true,
        value: content.postalCode,
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
          label: "Client Code",
          name: "clientCode",
          type: "text",
          value: formData?.clientCode,
          error: errors.clientCode,
          required: true,
        },
        {
          label: "Client Name",
          name: "clientName",
          type: "text",
          value: formData?.clientName,
          error: errors.clientName,
          required: true,
        },
        {
          label: "Address 1",
          name: "address1",
          type: "text",
          value: formData?.address1,
          error: errors.address1,
          required: true,
        },
        {
          label: "Address 2",
          name: "address2",
          type: "text",
          value: formData?.address2,
        },
        {
          label: "Address 3",
          name: "address3",
          type: "text",
          value: formData?.address3,
        },
        {
          label: "Country",
          name: "country",
          type: "text",
          value: formData?.country,
          error: errors.country,
          required: true,
        },
        {
          label: "State",
          name: "state",
          type: "text",
          value: formData?.state,
          error: errors.state,
          required: true,
        },
        {
          label: "Postal Code",
          name: "postalCode",
          type: "text",
          value: formData?.postalCode,
          error: errors.postalCode,
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

  const getAllClients = useCallback(() => {
    GetAllClients()
      .then((response) => {
        setData({
          actions: {
            edit: true,
            delete: true,
            view: true,
          },
          content: response.map((content) => {
            return contentConfig({
              clientId: content.clientMasterId,
              clientCode: content.clientCode,
              clientName: content.clientName,
              address1: content.addressLine1,
              address2: content.addressLine2,
              address3: content.addressLine3,
              postalCode: content.postalCode,
              country: content.country,
              state: content.state,
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
      if (!formData.clientId) {
        try {
          const res = await DedupeClient(formData.clientCode);
          if (res) {
            Toaster("warning", "Client code is already present");
            return;
          }
        } catch (err) {
          console.log(err);
        }
      }
      const payLoad = {
        ...formData,
        clientId: formData.clientId || null,
        user: "mani",
        addressLine1: formData.address1 || null,
        addressLine2: formData.address2 || null,
        addressLine3: formData.address3 || null,
      };
      await CreateOrUpdateClient(payLoad)
        .then(() => {
          getAllClients();
          Toaster("success", "Client successfully added.");
        })
        .catch((error) => {
          Toaster("error", error?.response?.data?.message);
        });
      resetForm();
    } else {
      Toaster("error", "Please enter a valid content");
    }
  }, [formData, validate, getAllClients, resetForm]);

  useEffect(() => {
    getAllClients();
    setHeaders([
      "Client Code",
      "Client Name",
      "Country",
      "State",
      "Postal Code",
      "Action",
    ]);
  }, [getAllClients]);

  const editData = useCallback(
    (data) => {
      resetForm();
      setFormData(data);
      setErrors(defaultErrors);
      setDisableForm(false);
    },
    [resetForm]
  );

  const viewData = useCallback(
    (data) => {
      resetForm();
      setFormData(data);
      setErrors(defaultErrors);
      setDisableForm(true);
    },
    [resetForm]
  );

  const deleteData = useCallback(
    (item) => {
      DeleteClient(item.clientId)
        .then(() => {
          Toaster("success", "Client was successfully deleted");
          getAllClients();
        })
        .catch();
    },
    [getAllClients]
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
        title="Client Configuration"
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

export default ClientMaster;
