import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import ConfigTable from "../../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";
import {
  SaveVendor,
  SearchVendor,
} from "../../../../service/api/emsService/VendorService";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import { EmployeeDataContext } from "../../../../customHooks/dataProviders/EmployeeDataProvider";
import ManagerApproval from "../VendorApproval/ManagerApproval";
import { UserManagentContext } from "../../../../customHooks/dataProviders/UserManagementProvider";
import dayjs from "dayjs";

const defaultFormData = {
  vendorName: "",
  client: "",
  resource: "",
  contractType: "Hourly",
  clientRate: "",
  ssitRate: "",
  marginRate: "",
  status: "Active",
  startDate: "",
  endDate: "",
};

const VendorDetails = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [vendors, setVendors] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { employeeData } = useContext(EmployeeDataContext);
  const { userManagementData } = useContext(UserManagentContext);

  const userRoles = useMemo(
    () => ({
      vendor_config: userManagementData?.roleNames?.includes("vendor_config"),
      vendor_approval:
        userManagementData?.roleNames?.includes("vendor_approval"),
    }),
    [userManagementData?.roleNames]
  );

  const tabOptions = useMemo(() => {
    const tabs = [];
    if (userRoles.vendor_config) tabs.push("Vendor Configuration");
    if (userRoles.vendor_approval) tabs.push("Manager Approval");
    return tabs;
  }, [userRoles]);

  const currentTab = tabOptions?.[activeTab] ?? "";

  const fetchVendors = useCallback(async () => {
    try {
      const response = await SearchVendor({
        workflowStatuses: ["101"],
        page: "0",
        size: "10",
      });
      setVendors(response?.content || []);
    } catch {
      Toaster("error", "Failed to fetch vendors.");
    }
  }, []);

  useEffect(() => {
    if (currentTab === "Vendor Configuration") {
      fetchVendors();
    }
  }, [currentTab, fetchVendors]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const updatedForm = { ...formData, [name]: value };

      if (name === "startDate" || name === "endDate") {
        updatedForm[name] = value ? dayjs(value) : null;
      }
      const clientRate = parseFloat(
        name === "clientRate" ? value : updatedForm.clientRate
      );
      const ssitRate = parseFloat(
        name === "ssitRate" ? value : updatedForm.ssitRate
      );

      if (!isNaN(clientRate) && !isNaN(ssitRate) && clientRate !== 0) {
        const marginRate = ((clientRate - ssitRate) / clientRate) * 100;
        updatedForm.marginRate = marginRate.toFixed(2);
      } else {
        updatedForm.marginRate = "";
      }

      setFormData(updatedForm);
    },
    [formData]
  );

  const handleReset = useCallback(() => {
    setFormData(defaultFormData);
    setDisableForm(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    const {
      vendorName,
      client,
      resource,
      contractType,
      clientRate,
      ssitRate,
      marginRate,
      status,
      startDate,
      endDate,
    } = formData;

    const isEmpty = (val) => val === undefined || val === null || val === "";

    const requiredFields = [
      vendorName,
      client,
      resource,
      contractType,
      clientRate,
      ssitRate,
      startDate,
      endDate,
    ];

    if (requiredFields.some(isEmpty)) {
      Toaster("warning", "Please fill all mandatory fields.");
      return;
    }

    // Check if endDate is greater than or equal to startDate
    if (new Date(endDate) < new Date(startDate)) {
      Toaster("warning", "End Date cannot be earlier than Start Date.");
      return;
    }

    const payload = {
      vendorName,
      client,
      resource,
      contractType,
      clientRatePerHour: parseFloat(clientRate),
      ssItRatePerHour: parseFloat(ssitRate),
      rateMarginPerHour: parseFloat(marginRate),
      vendorStatus: status,
      workflowStatus: "108",
      status,
      empId: employeeData?.employeeBasicDetailId || 0,
      startDate,
      endDate,
    };

    try {
      await SaveVendor(payload);
      Toaster("success", "Vendor saved successfully.");
      handleReset();
      fetchVendors();
    } catch (err) {
      console.error("Vendor Save Error:", err);
      Toaster("error", "Failed to save vendor.");
    }
  }, [formData, fetchVendors, handleReset, employeeData]);

  const handleDelete = useCallback((index) => {
    setVendors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleView = useCallback((item) => {
    const validItem = {
      vendorName: item?.vendorName || "",
      client: item?.client || "",
      resource: item?.resource || "",
      contractType: item?.contractType || "Hourly",
      clientRate: item?.clientRate || "",
      ssitRate: item?.ssitRate || "",
      marginRate: item?.marginRate || "",
      status: item?.status || "Active",
      startDate: item?.startDate || "",
      endDate: item?.endDate || "",
    };
    setFormData(validItem);
    setDisableForm(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setFormData(item);
    setDisableForm(false);
  }, []);

  const handleActionClick = useCallback(
    (action, item) => {
      switch (action) {
        case "edit":
          handleEdit(item);
          break;
        case "view":
          handleView(item);
          break;
        case "delete":
          handleDelete(item.index);
          break;
        default:
          break;
      }
    },
    [handleEdit, handleView, handleDelete]
  );

  const formConfig = useMemo(
    () => [
      {
        label: "Vendor Name",
        name: "vendorName",
        type: "text",
        value: formData.vendorName,
        required: true,
      },
      {
        label: "Client",
        name: "client",
        type: "text",
        value: formData.client,
        required: true,
      },
      {
        label: "Resource",
        name: "resource",
        type: "text",
        value: formData.resource,
        required: true,
      },
      {
        label: "Contract Type",
        name: "contractType",
        type: "dropDownList", // dropdown for contract type
        value: formData.contractType || "Hourly", // default value
        required: true,
        options: [
          { key: "Hourly", value: "Hourly" },
          { key: "Monthly", value: "Monthly" },
          { key: "Daily", value: "Daily" },
        ],
      },
      {
        label: "Client Rate Per Hour",
        name: "clientRate",
        type: "number",
        value: formData.clientRate,
        required: true,
      },
      {
        label: "Vendor Rate Per Hour",
        name: "ssitRate",
        type: "number",
        value: formData.ssitRate,
        required: true,
      },
      {
        label: "Margin Rate Per Hour",
        name: "marginRate",
        type: "text",
        value: formData.marginRate ? `${formData.marginRate}%` : "",
        disable: true,
      },
      {
        label: "Start Date",
        name: "startDate",
        type: "datePicker",
        value: formData.startDate ? dayjs(formData.startDate) : null,
        required: true,
        min: new Date().toISOString().split("T")[0],
      },
      {
        label: "End Date",
        name: "endDate",
        type: "datePicker",
        value: formData.endDate ? dayjs(formData.endDate) : null,
        required: true,
        min: formData.startDate || new Date().toISOString().split("T")[0],
      },
      {
        label: "Status",
        name: "status",
        type: "dropDownList",
        value: formData.status,
        options: [
          { key: "Active", value: "Active" },
          { key: "Inactive", value: "Inactive" },
        ],
      },
    ],
    [formData]
  );

  const tableData = useMemo(
    () => ({
      content: vendors.map((vendor, index) => [
        { value: vendor.vendorName, isPrint: true, forAction: false },
        { value: vendor.client, isPrint: true, forAction: false },
        { value: vendor.resource, isPrint: true, forAction: false },
        { value: vendor.contractType, isPrint: true, forAction: false }, // New contract type column
        {
          value: `$${vendor.clientRate ?? vendor.clientRatePerHour}`,
          isPrint: true,
          forAction: false,
        },
        {
          value: `$${vendor.ssitRate ?? vendor.ssItRatePerHour}`,
          isPrint: true,
          forAction: false,
        },
        {
          value:
            vendor.rateMargin ?? vendor.rateMarginPerHour
              ? `${vendor.rateMargin ?? vendor.rateMarginPerHour}%`
              : "",
          isPrint: true,
          forAction: false,
        },
        { value: vendor.startDate, isPrint: true, forAction: false }, // Start date column
        { value: vendor.endDate, isPrint: true, forAction: false }, // End date column
        {
          value: vendor?.vendorStatus || "N/A",
          isPrint: true,
          forAction: false,
        },
        { value: { ...vendor, index }, isPrint: false, forAction: true },
      ]),
      // actions: { edit: true, delete: true, view: true },
    }),
    [vendors]
  );

  return (
    <Box sx={{ padding: 2, maxWidth: "1200px", margin: "auto" }}>
      <Tabs
        value={Math.min(activeTab, tabOptions.length - 1)}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ marginBottom: 2 }}
      >
        {tabOptions.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {currentTab === "Vendor Configuration" && (
        <>
          <Box
            sx={{
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Vendor Management
            </Typography>
            <ConfigureForm
              data={formConfig}
              handleChange={handleChange}
              submitClicked={handleSubmit}
              resetButton={handleReset}
              formDisabled={disableForm}
              actionsHide={true}
              buttonsHide={{ reset: true, save: true }}
              buttonTitle="Submit"
            />
          </Box>

          <Box
            sx={{
              padding: 2,
              marginTop: 3,
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
            }}
          >
            {vendors.length > 0 ? (
              <ConfigTable
                data={tableData}
                headers={[
                  "Vendor Name",
                  "Client",
                  "Resource",
                  "Contract Type",
                  "Client Rate",
                  "SSIT Rate",
                  "Rate Margin",
                  "Start Date",
                  "End Date",
                  "Status",
                ]}
                selectionTable={false}
                pagination={false}
                actions={handleActionClick}
              />
            ) : (
              <p style={{ textAlign: "center", color: "red" }}>
                No Vendor Data Available
              </p>
            )}
          </Box>
        </>
      )}

      {currentTab === "Manager Approval" && <ManagerApproval />}
    </Box>
  );
};

export default VendorDetails;
