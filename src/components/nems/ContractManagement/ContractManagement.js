import { useContext, useState, useEffect } from "react";
import { Tab, Tabs, Box, Typography } from "@mui/material";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { Toaster } from "../../../common/alertComponets/Toaster";
import dayjs from "dayjs"; // Import dayjs for date formatting
import {
  getSowDetails,
  SaveSowDetails,
  updateSowDetails,
} from "../../../service/api/nemsService/ContractManagerService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import ContractReport from "./ContractReport";
import SearchSOW from "./SearchSOW";

function ContractManagement() {
  const [tabsValue, setTabsValue] = useState(0);
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState({
    account: "",
    sowID: "",
    sowName: "",
    poNumber: "",
    milestoneMonth: "",
    currency: "",
    milestoneAmount: "",
    approxUSD: "",
    sowStart: "",
    sowEnd: "",
    deliveryManager: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check if employeeBasicDetailId exists on page load
  useEffect(() => {
    if (!employeeData?.employeeBasicDetailId) {
      Toaster(
        "error",
        "Employee details not found. Please check your session or contact support."
      );
      throw new Error(
        "Employee details not found. employeeBasicDetailId is missing."
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        deliveryManager: employeeData?.fullName || "",
      }));
    }
  }, [employeeData]);

  const handleTabChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const newErrors = {
      account: formData.account === "" ? "Account is required" : "",
      sowID: formData.sowID === "" ? "SOW ID is required" : "",
      sowName: formData.sowName === "" ? "SOW Name is required" : "",
      poNumber: formData.poNumber === "" ? "PO# is required" : "",
      milestoneMonth:
        formData.milestoneMonth === "" ? "Milestone Month is required" : "",
      currency: formData.currency === "" ? "Currency is required" : "",
      milestoneAmount:
        formData.milestoneAmount === "" ? "Milestone Amount is required" : "",
      approxUSD: formData.approxUSD === "" ? "Approx USD is required" : "",
      sowStart: formData.sowStart === "" ? "SOW Start is required" : "",
      sowEnd: formData.sowEnd === "" ? "SOW End is required" : "",
      deliveryManager:
        formData.deliveryManager === "" ? "Delivery Manager is required" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      const payload = {
        id: isEditing ? formData.id : 0,
        account: formData.account,
        sowId: formData.sowID,
        sowName: formData.sowName,
        po: formData.poNumber,
        milestoneMonth: formData.milestoneMonth,
        currency: formData.currency,
        milestoneAmount: parseFloat(formData.milestoneAmount),
        approxAmount: parseFloat(formData.approxUSD),
        sowStartDate: dayjs(formData.sowStart).format("YYYY-MM-DD"),
        sowEndDate: dayjs(formData.sowEnd).format("YYYY-MM-DD"),
        deliveryManagerId: employeeData?.employeeBasicDetailId,
        status: "Active",
      };

      try {
        if (isEditing) {
          await updateSowDetails(payload.id, payload);
          Toaster("success", "SOW details successfully updated and saved");
        } else {
          await SaveSowDetails(payload);
          Toaster("success", "SOW details successfully added and saved");
        }
        handleReset();
      } catch (error) {
        Toaster("error", "Failed to save SOW details");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      account: "",
      sowID: "",
      sowName: "",
      poNumber: "",
      milestoneMonth: "",
      currency: "",
      milestoneAmount: "",
      approxUSD: "",
      sowStart: "",
      sowEnd: "",
      deliveryManager: employeeData?.fullName || "",
    });
    setErrors({});
    setSubmitted(false);
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formFields = [
    {
      type: "text",
      name: "account",
      label: "Account",
      value: formData.account,
      required: true,
      error: submitted && errors.account,
    },
    {
      type: "text",
      name: "sowID",
      label: "SOW ID",
      value: formData.sowID,
      required: true,
      error: submitted && errors.sowID,
    },
    {
      type: "text",
      name: "sowName",
      label: "SOW Name",
      value: formData.sowName,
      required: true,
      error: submitted && errors.sowName,
    },
    {
      type: "text",
      name: "poNumber",
      label: "PO#",
      value: formData.poNumber,
      required: true,
      error: submitted && errors.poNumber,
    },
    {
      type: "monthAndYearSelect",
      name: "milestoneMonth",
      label: "Milestone Month",
      value: formData.milestoneMonth,
      required: true,
      error: submitted && errors.milestoneMonth,
      InputLabelProps: { shrink: true },
    },
    {
      type: "dropDownList",
      name: "currency",
      label: "Currency",
      value: formData.currency,
      required: true,
      error: submitted && errors.currency,
      options: [
        { key: "USD", value: "USD" },
        { key: "INR", value: "INR" },
        { key: "EUR", value: "EUR" },
      ],
    },
    {
      type: "number",
      name: "milestoneAmount",
      label: "Milestone Amount",
      value: formData.milestoneAmount,
      required: true,
      error: submitted && errors.milestoneAmount,
    },
    {
      type: "number",
      name: "approxUSD",
      label: "Approx USD",
      value: formData.approxUSD,
      required: true,
      error: submitted && errors.approxUSD,
    },
    {
      type: "date",
      name: "sowStart",
      label: "SOW Start",
      value: formData.sowStart,
      required: true,
      error: submitted && errors.sowStart,
      InputLabelProps: { shrink: true },
    },
    {
      type: "date",
      name: "sowEnd",
      label: "SOW End",
      value: formData.sowEnd,
      required: true,
      error: submitted && errors.sowEnd,
      InputLabelProps: { shrink: true },
    },
    {
      type: "text",
      name: "deliveryManager",
      label: "Delivery Manager",
      value: formData.deliveryManager,
      required: true,
      error: submitted && errors.deliveryManager,
      disable: true,
    },
  ];

  return (
    <Box sx={{ ...panelStyle, p: 0 }} component="div">
      <Tabs
        sx={{
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px",
            minWidth: "50px",
            padding: "6px 12px",
          },
        }}
        value={tabsValue}
        onChange={handleTabChange}
        variant="scrollable"
      >
        <Tab label="SOW Entry" value={0} />
        <Tab label="SOW Details" value={1} />
        <Tab label="SOW Report" value={2} />
      </Tabs>
      <Box sx={{ p: 2 }}>
        {tabsValue === 0 && (
          <ConfigureForm
            data={formFields}
            handleChange={handleChange}
            buttonTitle={isEditing ? "Update" : "Submit"}
            submitClicked={handleSubmit}
            resetButton={handleReset}
          />
        )}
        {tabsValue === 1 && <SearchSOW />}
        {tabsValue === 2 && <ContractReport />}
      </Box>
    </Box>
  );
}

export default ContractManagement;
