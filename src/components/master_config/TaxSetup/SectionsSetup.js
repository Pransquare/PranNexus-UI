import React, { useState, useEffect, useCallback } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { deleteSections, getSections, saveSections, updateSection } from "../../../service/api/nemsService/TdsService";

function SectionSetup() {
  const [formData, setFormData] = useState({
    sectionCode: "",
    sectionDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionResponse = await getSections();
        const formattedData = sectionResponse.map((item) => ({
          id: item.id,
          sectionCode: item.code,
          sectionDescription: item.description,
          status: item.status,
        }));
        setData(formattedData);
        setTotalCount(formattedData.length);
      } catch (error) {
        Toaster("error", "Failed to load data");
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
      sectionCode: formData.sectionCode === "" ? "Section Code is required" : "",
      sectionDescription: formData.sectionDescription === "" ? "Section Description is required" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      const payload = {
        id: isEditing ? data[editIndex]?.id : 0,
        code: formData.sectionCode,
        description: formData.sectionDescription,
        status: "Active",
        subsectionConfigurations: [],
      };

      try {
        let response;
        if (isEditing) {
          response = await updateSection(payload);
        } else {
          response = await saveSections(payload);
        }

        if (response.success) {
          const newData = {
            id: response.data.id,
            sectionCode: payload.code,
            sectionDescription: payload.description,
            status: payload.status,
          };

          if (isEditing) {
            const updatedData = [...data];
            updatedData[editIndex] = newData;
            setData(updatedData);
            Toaster("success", "Section updated successfully");
          } else {
            setData([...data, newData]);
            Toaster("success", "Section added successfully");
          }
          handleReset();
        } else {
          Toaster("error", response.message || "Failed to save section");
        }
      } catch (error) {
        Toaster("error", "An error occurred while saving section");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      sectionCode: "",
      sectionDescription: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = useCallback((rowData, index) => {
    setFormData({
      sectionCode: rowData.sectionCode,
      sectionDescription: rowData.sectionDescription,
    });
    setIsEditing(true);
    setEditIndex(index);
  }, []);

  const confirmDelete = useCallback((index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const section = data[deleteIndex];
  
    if (!section) {
      Toaster("error", "Invalid section data");
      setDeleteDialogOpen(false);
      return;
    }
  
    try {
      const response = await deleteSections(section.id);
  
      if (response.success) {
        const updatedData = data.filter((_, i) => i !== deleteIndex);
        setData(updatedData);
        Toaster("success", "Section deleted successfully");
      } else {
        Toaster("error", response.message || "Failed to delete section");
      }
    } catch (error) {
      Toaster("error", "An error occurred while deleting the section");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  }, [deleteIndex, data]);   

  const headers = ["Section Code", "Section Description", "Status", "Actions"];

  const contentConfig = {
    actions: {
      edit: true,
      delete: true,
    },
    content: data.map((row) => [
      { value: row.sectionCode || "N/A", isPrint: true },
      { value: row.sectionDescription || "N/A", isPrint: true },
      { value: row.status || "N/A", isPrint: true },
      {
        forAction: true,
        value: row,
        customActions: null,
      },
    ]),
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <ConfigureForm
        data={[
          {
            type: "text",
            name: "sectionCode",
            label: "Section Code",
            value: formData.sectionCode,
            required: true,
            error: errors.sectionCode,
          },
          {
            type: "text",
            name: "sectionDescription",
            label: "Section Description",
            value: formData.sectionDescription,
            required: true,
            error: errors.sectionDescription,
          },
        ]}
        buttonTitle={isEditing ? "Update" : "Save"}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        resetButton={handleReset}
      />
      <ConfigTable
        data={contentConfig}
        headers={headers}
        actions={(event, rowData, index) => {
          if (event === "edit") handleEdit(rowData, index);
          if (event === "delete") confirmDelete(index);
        }}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        totalCount={totalCount}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete this section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SectionSetup;
