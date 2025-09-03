import React, { useState, useEffect } from "react";
import { Tab, Tabs, Box, Typography } from "@mui/material";
import { UserManagentCheck } from "../../../common/UserManagement";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import {
  getSections,
  getFinancialYear,
  getFinancialyearRegimeSectionConfig,
  saveFinancialyearRegimeSectionConfig,
  getRegimes,
  deleteSectionSubsectionConfig,
  deleteFinancialyearRegimeSectionConfig,
  deleteByFinancialYearCodeAndRegimeCode,
} from "../../../service/api/emsService/TdsService";
import { Toaster } from "../../../common/alertComponets/Toaster";

function TdsConfiguration() {
  const [tabsValue, setTabsValue] = useState(0);
  const [formData, setFormData] = useState({
    financialYearCode: "",
    regimeCode: "",
    sectionCodes: [],
  });
  const [sectionsOptions, setSectionsOptions] = useState([]);
  const [RegimeOptions, setRegimeOptions] = useState([]);
  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sectionsData, financialYearData, regimesData, configData] = await Promise.all([
          getSections(),
          getFinancialYear(),
          getRegimes(),
          getFinancialyearRegimeSectionConfig(),
        ]);
  
        setSectionsOptions(
          sectionsData
            .filter((item) => item.status === "Active")
            .map((item) => ({ key: item.code, value: item.description }))
        );
  
        setFinancialYearOptions(
          financialYearData
            .filter((item) => item.status === "Active")
            .map((item) => ({ key: item.code, value: item.financialYear }))
        );
  
        setRegimeOptions(
          regimesData
            .filter((item) => item.status === "Active")
            .map((item) => ({ key: item.code, value: item.regimeDescription }))
        );
  
        const formattedData = configData.reduce((acc, item) => {
          const existing = acc.find(
            (config) =>
              config.financialYear === item.financialYearCode &&
              config.regimeCode === item.regime.code
          );
          if (existing) {
            // Merge sections if the financial year and regime already exist
            existing.sections.push(item.section.description);
            existing.sectionCodes.push(item.section.code);
          } else {
            acc.push({
              id: item.id,
              financialYear: item.financialYearCode,
              regimeCode: item.regime.code, // Use regimeCode instead of regimeDescription
              sections: [item.section.description],
              sectionCodes: [item.section.code],
            });
          }
          return acc;
        }, []);
  
        setAllData(formattedData);
      } catch (error) {
        Toaster("error", "Failed to load initial data.");
        console.error("Error fetching data:", error);
      }
    };
  
    fetchInitialData();
  }, []);
  
  const handleTabChange = (event, newValue) => setTabsValue(newValue);

  const handleSubmit = async () => {
    const newErrors = {
      financialYearCode: formData.financialYearCode ? "" : "Financial Year is required",
      regimeCode: formData.regimeCode ? "" : "Regime is required",
      sectionCodes: formData.sectionCodes.length ? "" : "At least one section is required",
    };
    setErrors(newErrors);
  
    if (Object.values(newErrors).every((error) => error === "")) {
      // Prepare the payload as required by the backend
      const payload = {
        id: isEditing ? editingId : 0, // Use editingId if editing, otherwise 0
        financialYearCode: formData.financialYearCode,
        regimeCode: formData.regimeCode,
        sectionCodes: formData.sectionCodes,
        status: "Active", // Assuming status is always "Active"
      };
  
      try {
        const response = await saveFinancialyearRegimeSectionConfig(payload);
  
        if (response && Array.isArray(response)) {
          Toaster("success", isEditing ? "Configuration updated successfully" : "Configuration added successfully");
  
          // Find the regime description using the regimeCode
          const regimeDescription = RegimeOptions.find(
            (option) => option.key === formData.regimeCode
          )?.value;
  
          // Update the allData state
          setAllData((prevData) => {
            const existingConfigIndex = prevData.findIndex(
              (item) =>
                item.financialYear === formData.financialYearCode &&
                item.regimeCode === formData.regimeCode
            );
  
            if (existingConfigIndex !== -1) {
              // Update existing entry
              const updatedData = [...prevData];
              updatedData[existingConfigIndex] = {
                id: updatedData[existingConfigIndex].id, // Preserve the existing ID
                financialYear: formData.financialYearCode,
                regimeCode: formData.regimeCode,
                regime: regimeDescription, // Add regime description for display
                sectionCodes: [...formData.sectionCodes], // Replace with new section codes
                sections: formData.sectionCodes.map((sectionCode) =>
                  sectionsOptions.find((option) => option.key === sectionCode)?.value
                ),
              };
              return updatedData;
            } else {
              // Add a new entry
              return [
                ...prevData,
                {
                  id: response.id, // Assuming the response contains the new ID
                  financialYear: formData.financialYearCode,
                  regimeCode: formData.regimeCode,
                  regime: regimeDescription, // Add regime description for display
                  sections: formData.sectionCodes.map((sectionCode) =>
                    sectionsOptions.find((option) => option.key === sectionCode)?.value
                  ),
                  sectionCodes: formData.sectionCodes,
                },
              ];
            }
          });
  
          handleReset();
        } else {
          Toaster("error", "Failed to save configuration");
        }
      } catch (error) {
        Toaster("error", "An error occurred while saving configuration");
        console.error(error);
      }
    }
  };
  
  

  const handleReset = () => {
    setFormData({
      financialYearCode: "",
      regimeCode: "",
      sectionCodes: [],
    });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (rowData) => {
    setFormData({
      financialYearCode: rowData.financialYear,
      regimeCode: rowData.regimeCode,
      sectionCodes: rowData.sectionCodes,
    });
    setIsEditing(true);
    setEditingId(rowData.id);
  };

  const handleDelete = async (rowData) => {
    const { financialYear, regimeCode } = rowData;
  
    if (!financialYear || !regimeCode) {
      Toaster("error", "Invalid financial year or regimeCode for deletion");
      return;
    }
  
    try {
      const response = await deleteByFinancialYearCodeAndRegimeCode(financialYear, regimeCode);
  
      if (response.success) {
        Toaster("success", "Configuration deleted successfully");
        setAllData((prev) =>
          prev.filter(
            (config) =>
              config.financialYear !== financialYear || config.regimeCode !== regimeCode
          )
        );
      } else {
        Toaster("error", response.message || "Failed to delete configuration");
      }
    } catch (error) {
      Toaster("error", "An error occurred while deleting configuration");
      console.error(error);
    }
  };
  
  
  

  const formFields = [
    {
      type: "dropDownList",
      name: "financialYearCode",
      label: "Financial Year",
      value: formData.financialYearCode,
      options: financialYearOptions,
      required: true,
      error: errors.financialYearCode,
    },
    {
      type: "dropDownList",
      name: "regimeCode",
      label: "Regime",
      value: formData.regimeCode,
      options: RegimeOptions,
      required: true,
      error: errors.regimeCode,
    },
    {
      type: "multiSelect",
      name: "sectionCodes",
      label: "Sections",
      value: formData.sectionCodes,
      options: sectionsOptions,
      required: true,
      error: errors.sectionCodes,
    },
  ];

  return (
    <Box sx={{ ...panelStyle, p: 0 }} component="div">
      <Tabs
        sx={{
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": { fontSize: "12px", minWidth: "50px", padding: "6px 12px" },
        }}
        value={tabsValue}
        onChange={handleTabChange}
        variant="scrollable"
      >
        {UserManagentCheck("hr_tools_ems_leave_leaveApply") && (
          <Tab label="TDS Configuration Details" value={0} />
        )}
      </Tabs>
      <Box sx={{ p: 2 }}>
        <ConfigureForm
          data={formFields}
          handleChange={(e) => {
            const { name, value } = e.target;
            if (name === "regimeCode") {
              const selectedRegime = RegimeOptions.find((option) => option.key === value);
              setFormData({ ...formData, [name]: selectedRegime ? selectedRegime.key : "" });
            } else {
              setFormData({ ...formData, [name]: value });
            }
          }}
                    buttonTitle={isEditing ? "Update" : "Submit"}
          submitClicked={handleSubmit}
          resetButton={handleReset}
        />
        <Box sx={{ mt: 2 }}>
          {allData.length > 0 ? (
            <ConfigTable
              data={{
                content: allData.map((item) => [
                  { value: item.financialYear, isPrint: true },
                  { value: item.regimeCode, isPrint: true },
                  { value: item.sections.join(", "), isPrint: true },
                  { value: "", forAction: true },
                ]),
                actions: { edit: true, delete: true },
              }}
              headers={["Financial Year", "Regime Code", "Sections", "Actions"]}
              actions={(actionType, rowData, index) => {
                if (actionType === "edit") handleEdit(allData[index]);
                if (actionType === "delete") handleDelete(allData[index]);
              }}
            />
         
          ) : (
            <Typography variant="body1">No data found.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default TdsConfiguration;
