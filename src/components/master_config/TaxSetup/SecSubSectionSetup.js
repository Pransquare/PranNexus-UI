import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import {
  getSections,
  getSubSections,
  saveSectionSubsectionConfig,
  updateSectionSubsectionConfig,
  getSectionSubsectionConfig,
  deleteSubsection,
  deleteSectionSubsectionConfig,
} from "../../../service/api/nemsService/TdsService";

function SecSubSecSetup() {
  const [sections, setSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [formData, setFormData] = useState({
    sectionCode: "",
    subsectionCodes: [],
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsResponse, subsectionsResponse, configsResponse] = await Promise.all([
          getSections(),
          getSubSections(),
          getSectionSubsectionConfig(),
        ]);

        setSections(
          sectionsResponse.map((section) => ({
            key: section.code,
            value: section.description || section.code,
          }))
        );

        setSubsections(
          subsectionsResponse.map((subsection) => ({
            key: subsection.code,
            value: subsection.description || subsection.code,
          }))
        );

        setConfigurations(configsResponse);
      } catch (error) {
        Toaster("error", "Failed to load sections, subsections, or configurations");
      }
    };

    fetchData();
  }, []);

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

  const handleSubmit = async () => {
    const newErrors = {
      sectionCode: formData.sectionCode === "" ? "Section is required" : "",
      subsectionCodes: formData.subsectionCodes.length === 0 ? "At least one subsection is required" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      const payload = {
        id: isEditing ? editId : 0,
        sectionCode: formData.sectionCode,
        subSectionCode: formData.subsectionCodes,
      };

      try {
        let response;
        if (isEditing) {
          response = await updateSectionSubsectionConfig(payload);
        } else {
          response = await saveSectionSubsectionConfig(payload);
        }

        if (response.success) {
          Toaster("success", isEditing ? "Configuration updated successfully" : "Configuration added successfully");

          if (isEditing) {
            setConfigurations((prev) =>
              prev.map((config) =>
                config.id === editId ? { ...config, ...payload, status: "Active" } : config
              )
            );
          } else {
            const updatedConfigs = await getSectionSubsectionConfig();
            setConfigurations(updatedConfigs);
          }

          handleReset();
        } else {
          Toaster("error", response.message || "Failed to save configuration");
        }
      } catch (error) {
        Toaster("error", "An error occurred while saving configuration");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      sectionCode: "",
      subsectionCodes: [],
    });
    setErrors({});
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (rowData) => {
    setFormData({
      sectionCode: rowData.sectionCode,
      subsectionCodes: [rowData.subsectionCode],
    });
    setIsEditing(true);
    setEditId(rowData.id);
  };

  const handleDelete = async (rowData) => {
    try {
      if (!rowData.id) {
        Toaster("error", "Invalid configuration ID");
        return;
      }
  
      const response = await deleteSectionSubsectionConfig(rowData.id); // Use the API with dynamic ID in the URL
  
      if (response.success) {
        Toaster("success", "Configuration deleted successfully");
        setConfigurations((prev) => prev.filter((config) => config.id !== rowData.id));
      } else {
        Toaster("error", response.message || "Failed to delete configuration");
      }
    } catch (error) {
      Toaster("error", "An error occurred while deleting configuration");
    }
  };
  

  const headers = ["Section Description", "Subsection Description", "Status", "Actions"];

  const contentConfig = {
    actions: {
      edit: true,
      delete: true,
    },
    content: configurations.map((config) => [
      { value: config.section?.description || "N/A", isPrint: true },
      { value: config.subsection?.description || "N/A", isPrint: true },
      { value: config.status || "N/A", isPrint: true },
      {
        forAction: true,
        value: config,
      },
    ]),
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Section & Subsection Setup
      </Typography>
      <ConfigureForm
        data={[
          {
            type: "dropDownList",
            name: "sectionCode",
            label: "Section",
            value: formData.sectionCode,
            required: true,
            error: errors.sectionCode,
            options: sections,
          },
          {
            type: "multiSelect",
            name: "subsectionCodes",
            label: "Subsections",
            value: formData.subsectionCodes,
            required: true,
            error: errors.subsectionCodes,
            options: subsections,
          },
        ]}
        buttonTitle={isEditing ? "Update" : "Save"}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        resetButton={handleReset}
      />
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Existing Configurations
      </Typography>
      <ConfigTable
        data={contentConfig}
        headers={headers}
        pagination={true}
        totalCount={configurations.length}
        page={0}
        rowsPerPage={5}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        actions={(event, rowData) => {
          if (event === "edit") handleEdit(rowData);
          if (event === "delete") handleDelete(rowData);
        }}
      />
    </Box>
  );
}

export default SecSubSecSetup;
