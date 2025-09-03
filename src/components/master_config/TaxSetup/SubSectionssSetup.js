import React, { useState, useEffect, useCallback } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { deleteSubSections, getSubSections, saveSubSections, updateSubsection } from "../../../service/api/emsService/TdsService";

function SubSectionsSetup() {
  const [formData, setFormData] = useState({
    subsectionCode: "",
    subsectionDescription: "",
    sectionCode: "",
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
        const subsectionResponse = await getSubSections();
        setData(subsectionResponse);
        setTotalCount(subsectionResponse.length);
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
      subsectionCode: formData.subsectionCode === "" ? "Subsection Code is required" : "",
      subsectionDescription: formData.subsectionDescription === "" ? "Subsection Description is required" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      const payload = {
        id: isEditing ? data[editIndex]?.id : 0,
        code: formData.subsectionCode,
        description: formData.subsectionDescription,
        sectionCode: formData.sectionCode,
        status: "Active",
      };

      try {
        let response;
        if (isEditing) {
          response = await updateSubsection(payload);
        } else {
          response = await saveSubSections(payload);
        }

        if (response.success) {
          const newData = {
            id: response.data.id,
            code: payload.code,
            description: payload.description,
            sectionCode: payload.sectionCode,
            status: payload.status,
          };

          if (isEditing) {
            const updatedData = [...data];
            updatedData[editIndex] = newData;
            setData(updatedData);
            Toaster("success", "Subsection updated successfully");
          } else {
            setData([...data, newData]);
            Toaster("success", "Subsection added successfully");
          }
          handleReset();
        } else {
          Toaster("error", response.message || "Failed to save subsection");
        }
      } catch (error) {
        Toaster("error", "An error occurred while saving subsection");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      subsectionCode: "",
      subsectionDescription: "",
      sectionCode: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = useCallback((rowData, index) => {
    setFormData({
      subsectionCode: rowData.code,
      subsectionDescription: rowData.description,
      sectionCode: rowData.sectionCode,
    });
    setIsEditing(true);
    setEditIndex(index);
  }, []);

  const confirmDelete = useCallback((index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const subsection = data[deleteIndex];
  
    if (!subsection?.id) {
      Toaster("error", "Invalid subsection ID");
      setDeleteDialogOpen(false);
      return;
    }
  
    try {
      const response = await deleteSubSections(subsection.id); // Pass ID directly
  
      if (response.success) {
        const updatedData = data.filter((_, i) => i !== deleteIndex);
        setData(updatedData);
        Toaster("success", "Subsection deleted successfully");
      } else {
        Toaster("error", response.message || "Failed to delete subsection");
      }
    } catch (error) {
      Toaster("error", "An error occurred while deleting subsection");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  }, [deleteIndex, data]);  

  const headers = ["Subsection Code", "Description", "Status", "Actions"];

  const contentConfig = {
    actions: {
      edit: true,
      delete: true,
    },
    content: data.map((row) => [
      { value: row.code || "N/A", isPrint: true },
      { value: row.description || "N/A", isPrint: true },
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
            name: "subsectionCode",
            label: "Subsection Code",
            value: formData.subsectionCode,
            required: true,
            error: errors.subsectionCode,
          },
          {
            type: "text",
            name: "subsectionDescription",
            label: "Subsection Description",
            value: formData.subsectionDescription,
            required: true,
            error: errors.subsectionDescription,
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
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        totalCount={totalCount}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete this subsection? This action cannot be undone.
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

export default SubSectionsSetup;
