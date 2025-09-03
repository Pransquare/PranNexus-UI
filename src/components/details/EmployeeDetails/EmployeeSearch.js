import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Tab, Tabs, TextField, Autocomplete, Typography } from "@mui/material";
import EmployeeDetails from "./EmployeeDetails";
import {
  GetEmployeeByEmployeeCode,
  GetEmployeesByName,
} from "../../../service/api/nemsService/EmployeeService";
import { GetAllDesignations } from "../../../service/api/DesinationService";
import { GetGroups } from "../../../service/api/pmsService/GetGroups";
import Popper from "@mui/material/Popper"; // Ensure Popper is imported
import { GetAllWorkLocation } from "../../../service/api/hrConfig/hrConfig";

// Custom Popper Component to handle dropdown positioning
function CustomPopper(props) {
  return (
    <Popper
      {...props}
      placement="bottom-start" // Align the dropdown with the input
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport", // Prevent the dropdown from going outside the viewport
          },
        },
      ]}
      style={{
        width: props.anchorEl ? props.anchorEl.clientWidth : undefined, // Match input field width
        zIndex: 1300, // Ensure dropdown is above other content
        overflow: "hidden", // Prevent content from overflowing the box
      }}
    />
  );
}

const defaultForm = {
  employee: null,
};

function EmployeeSearch() {
  const [formData, setFormData] = useState(defaultForm);
  const [searchResults, setSearchResults] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [apiData, setApiData] = useState();

  const handleChange = (event, value) => {
    setFormData({ employee: value });

    if (!value || !value.employeeCode) {
      setEmployee(null);
      return;
    }

    const employeeCode = value.employeeCode;

    if (employeeCode) {
      GetEmployeeByEmployeeCode(employeeCode)
        .then((data) => {
          setEmployee(data);
          setSearchResults([]);
        })
        .catch((error) => console.log(error));
    }
  };

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onloadData = async () => {
    try {
      const data = await Promise.all([
        GetAllDesignations(),
        GetGroups(),
        GetAllWorkLocation(),
      ]);
      setApiData({
        designations: data[0],
        groups: data[1],
        workLocation: data[2],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    onloadData();
  }, []);

  // Updated to clear employee state when input changes
  const handleInputChange = (event, value) => {
    if (value.length > 2) {
      setOptions(value);
    } else {
      setSearchResults([]);
    }

    if (!formData.employee || formData.employee.fullName !== value) {
      setEmployee(null);
    }
  };

  return (
    <Box sx={panelStyle}>
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px", // Decrease the font size
            minWidth: "50px", // Decrease the minimum width of each tab
            padding: "6px 12px", // Adjust the padding of each tab
          },
          "& .MuiTab-wrapper": {
            marginTop: "0", // Decrease the margin top of each tab
          },
        }}
        value={0}
      >
        <Tab label="Search" />
      </Tabs>
      <br />
      <Box component="div" className="m-1">
        <Autocomplete
          size="small"
          id="employee-search-bar"
          options={searchResults}
          getOptionLabel={(option) => option.fullName || ""} // Display the full name in the input
          value={formData.employee}
          onInputChange={handleInputChange}
          onChange={handleChange} // Handle selection
          renderOption={(props, option) => (
            <li {...props} key={option.employeeCode}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {option.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {option.emailId} ({option.employeeCode})
                </Typography>
              </Box>
            </li>
          )} // Custom render option to display full name, employee code, and email ID
          PopperComponent={CustomPopper} // Attach custom Popper to control dropdown behavior
          renderInput={(params) => (
            <TextField
              {...params}
              label="Employee Name"
              variant="outlined"
              size="small"
            />
          )}
        />
      </Box>

      {employee && (
        <EmployeeDetails
          inputData={employee}
          apiData={apiData}
          readOnly={employee?.status === "117"}
        />
      )}
    </Box>
  );
}

export default EmployeeSearch;
