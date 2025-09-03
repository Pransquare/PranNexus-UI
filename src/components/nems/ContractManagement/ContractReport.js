import React, { useState, useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  generateSowReport,
  getReportingIds,
} from "../../../service/api/nemsService/ContractManagerService"; // Adjust the path as needed
import dayjs from "dayjs";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";

function ContractReport() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [reportingIds, setReportingIds] = useState([]);
  const [formData, setFormData] = useState({
    sowStart: "",
    sowEnd: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const fetchReportingIds = async () => {
      try {
        const managerId = employeeData?.employeeBasicDetailId;
        if (managerId) {
          const response = await getReportingIds(managerId);
          setReportingIds(response || []);
        }
      } catch (error) {
        Toaster("error", "Failed to fetch reporting IDs");
      }
    };

    fetchReportingIds();
  }, [employeeData]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (
      (name === "sowStart" && formData.sowEnd) ||
      (name === "sowEnd" && formData.sowStart)
    ) {
      const sowStartDate = dayjs(
        name === "sowStart" ? value : formData.sowStart
      );
      const sowEndDate = dayjs(name === "sowEnd" ? value : formData.sowEnd);

      if (sowEndDate.isBefore(sowStartDate)) {
        Toaster(
          "error",
          "Please select an end date that is after the SOW start date."
        );
        setFormData((prev) => ({
          ...prev,
          sowEnd: name === "sowEnd" ? "" : prev.sowEnd,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const newErrors = {
      sowStart: formData.sowStart === "" ? "SOW Start Date is required" : "",
      sowEnd: formData.sowEnd === "" ? "SOW End Date is required" : "",
      status: formData.status === "" ? "Status is required" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const deliveryManagerIds = [
          employeeData?.employeeBasicDetailId,
          ...(reportingIds || 0),
        ];

        await generateSowReport(
          formData.sowStart,
          formData.sowEnd,
          formData.status,
          deliveryManagerIds
        );
        Toaster(
          "success",
          "Excel report generated and downloaded successfully"
        );
      } catch (error) {
        Toaster("error", "Failed to generate the Excel report");
      }
    } else {
      Toaster("error", "Please fill out the mandatory fields");
    }
  };

  const handleReset = () => {
    setFormData({
      sowStart: "",
      sowEnd: "",
      status: "Active",
    });
    setErrors({});
    setSubmitted(false);
  };

  const formFields = [
    {
      type: "date",
      name: "sowStart",
      label: "SOW Start Date",
      value: formData.sowStart,
      required: true,
      error: submitted && errors.sowStart,
      InputLabelProps: { shrink: true },
      placeholder: "YYYY-MM-DD",
    },
    {
      type: "date",
      name: "sowEnd",
      label: "SOW End Date",
      value: formData.sowEnd,
      required: true,
      error: submitted && errors.sowEnd,
      InputLabelProps: { shrink: true },
      placeholder: "YYYY-MM-DD",
    },
    {
      type: "dropDownList",
      name: "status",
      label: "Status",
      value: formData.status,
      required: true,
      error: submitted && errors.status,
      options: [
        { key: "Active", value: "Active" },
        { key: "Inactive", value: "Inactive" },
      ],
    },
  ];

  return (
    <Box sx={{ ...panelStyle, p: 2 }} component="div">
      <ConfigureForm
        data={formFields}
        handleChange={handleChange}
        buttonTitle="Generate Report"
        submitClicked={handleSubmit}
        resetButton={handleReset}
      />
    </Box>
  );
}

export default ContractReport;
