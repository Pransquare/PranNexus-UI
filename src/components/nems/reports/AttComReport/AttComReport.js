import { Box, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import React, { useCallback, useState, useEffect } from "react";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../../common/customStyles/CustomStyles";
import { GetEmployeesByName } from "../../../../service/api/nemsService/EmployeeService";
import { GenerateAttComReport } from "../../../../service/api/nemsService/TimeSheetService";
import { useParams } from "react-router-dom";
import { GetAllWorkLocation } from "../../../../service/api/hrConfig/hrConfig";

function AttComReport() {
  const [formData, setFormData] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [workLocationData, setWorkLocationData] = useState([]);
  const { type } = useParams();

  const configForm = useCallback(
    (input) => [
      {
        label: "From Date",
        name: "dateFrom",
        type: "datePicker",
        value: input?.dateFrom ? dayjs(input.dateFrom) : null,
        maxDate: dayjs(),
        required: true,
      },
      {
        label: "To Date",
        name: "dateTo",
        type: "datePicker",
        value: input?.dateTo ? dayjs(input.dateTo) : null,
        minDate: input?.dateFrom ? dayjs(input.dateFrom) : null,
        maxDate: dayjs(),
        required: true,
      },
      {
        label: "Work Location(s)",
        name: "workLocation",
        type: "multiSelect",
        value: input?.workLocation || [],
        options: workLocationData,
      },
      {
        name: "employee",
        label: "Employee Name",
        type: "suggestedDropdown",
        value: input?.employee || "",
        options:
          searchResults?.map((data) => ({
            key: data.employeeCode,
            value: data.fullName,
            subValue: data.emailId,
          })) || [],
      },
    ],
    [searchResults, workLocationData]
  );

  const setOptions = useCallback(
    (value) => {
      GetEmployeesByName(value)
        .then((data) => {
          if (Array.isArray(formData?.workLocation)) {
            const filtered = data.filter((a) =>
              formData.workLocation.includes(a.workLocationCode)
            );
            setSearchResults(filtered);
          } else {
            setSearchResults([]);
          }
        })
        .catch((error) => console.log(error));
    },
    [formData]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    // For multiselect fields like workLocation
    if (name === "workLocation") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: typeof value === "string" ? value.split(",") : value,
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "employee") {
      const employeeBasicDetailId = searchResults?.find(
        (data) => data.fullName === value
      )?.employeeBasicDetailId;

      if (employeeBasicDetailId) {
        setFormData((prev) => ({
          ...prev,
          selectedEmployee: employeeBasicDetailId,
        }));
        return;
      }

      if (value.length > 2) {
        setOptions(value);
      }

      setSearchResults([]);
      setFormData((prev) => ({
        ...prev,
        selectedEmployee: null,
      }));
    }
  };

  const submitClicked = () => {
    if (!formData?.dateFrom || !formData?.dateTo) {
      Toaster("error", "Please fill all the mandatory fields");
      return;
    }

    const selectedWorkLocations =
      formData?.workLocation?.length > 0
        ? formData.workLocation
        : workLocationData.map((loc) => loc.key); // fallback to all

    GenerateAttComReport({
      fromDate: dayjs(formData.dateFrom).format("YYYY-MM-DD"),
      toDate: dayjs(formData.dateTo).format("YYYY-MM-DD"),
      employeeId: formData.selectedEmployee,
      workLocationCodes: selectedWorkLocations,
      type: type,
    }).catch((err) => {
      console.log(err);
      Toaster("error", "Failed to generate report.");
    });
  };

  useEffect(() => {
    GetAllWorkLocation()
      .then((res) => {
        setWorkLocationData(
          res.map((a) => ({
            key: a.workLocationCode,
            value: a.workLocation,
          }))
        );
      })
      .catch(() => {
        Toaster("error", "Failed to fetch work locations");
      });
  }, []);

  useEffect(() => {
    setFormData({});
    setSearchResults([]);
  }, [type]);

  return (
    <Box sx={{ ...panelStyle, paddingBottom: "1rem" }}>
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px",
            minWidth: "50px",
            padding: "6px 12px",
          },
          "& .MuiTab-wrapper": {
            marginTop: "0",
          },
        }}
        value={0}
        variant="scrollable"
      >
        <Tab
          label={`${
            type === "compliance" ? "Attendance" : "Timesheet"
          } ${type} report`}
          value={0}
        />
      </Tabs>
      <Box>
        <ConfigureForm
          data={configForm(formData)}
          handleChange={handleChange}
          buttonTitle="Download"
          submitClicked={submitClicked}
          resetButton={() => {
            setFormData({});
            setSearchResults([]);
          }}
        />
      </Box>
    </Box>
  );
}

export default AttComReport;
