import React, { useState, useEffect, useCallback } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { deleteRegime, getRegimes, saveRegimes, updateRegime } from "../../../service/api/emsService/TdsService";

function RegimeSetup() {
  const [formData, setFormData] = useState({
    regimeCode: "",
    regimeDescription: "",
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
        const regimeResponse = await getRegimes();
        const formattedData = regimeResponse.map((item) => ({
          id: item.id,
          regimeCode: item.code,
          regimeDescription: item.regimeDescription,
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
      regimeCode: formData.regimeCode === "" ? "Regime Code is required" : "",
      regimeDescription: formData.regimeDescription === "" ? "Regime Description is required" : "",
    };
    setErrors(newErrors);
  
    if (Object.values(newErrors).every((error) => error === "")) {
      const payload = {
        id: isEditing ? data[editIndex]?.id : 0,
        code: formData.regimeCode,
        regimeDescription: formData.regimeDescription,
        status: "Active",
      };
  
      try {
        let response;
        if (isEditing) {
          response = await updateRegime(payload); 
        } else {
          response = await saveRegimes(payload); 
        }
  
        if (response.success) {
          const newData = {
            id: response.data.id,
            regimeCode: payload.code,
            regimeDescription: payload.regimeDescription,
            status: payload.status,
          };
  
          if (isEditing) {
            const updatedData = [...data];
            updatedData[editIndex] = newData;
            setData(updatedData);
            Toaster("success", "Regime updated successfully");
          } else {
            setData([...data, newData]);
            Toaster("success", "Regime added successfully");
          }
          handleReset();
        } else {
          Toaster("error", response.message || "Failed to save regime");
        }
      } catch (error) {
        Toaster("error", "An error occurred while saving regime");
      }
    }
  };
  

  const handleReset = () => {
    setFormData({
      regimeCode: "",
      regimeDescription: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = useCallback((rowData, index) => {
    setFormData({
      regimeCode: rowData.regimeCode,
      regimeDescription: rowData.regimeDescription,
    });
    setIsEditing(true);
    setEditIndex(index);
  }, []);
  

  const confirmDelete = useCallback((index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const regimeId = data[deleteIndex]?.id;

    if (!regimeId) {
      Toaster("error", "Invalid regime ID");
      setDeleteDialogOpen(false);
      return;
    }

    try {
      const response = await deleteRegime(regimeId);

      if (response.success) {
        const updatedData = data.filter((_, i) => i !== deleteIndex);
        setData(updatedData);
        Toaster("success", "Regime deleted successfully");
      } else {
        Toaster("error", response.message || "Failed to delete regime");
      }
    } catch (error) {
      Toaster("error", "An error occurred while deleting regime");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  }, [deleteIndex, data]);

  const headers = ["Regime Code", "Regime Description", "Status", "Actions"];

  const contentConfig = {
    actions: {
      edit: true,
      delete: true,
    },
    content: data.map((row) => [
      { value: row.regimeCode || "N/A", isPrint: true },
      { value: row.regimeDescription || "N/A", isPrint: true },
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
            name: "regimeCode",
            label: "Regime Code",
            value: formData.regimeCode,
            required: true,
            error: errors.regimeCode,
          },
          {
            type: "text",
            name: "regimeDescription",
            label: "Regime Description",
            value: formData.regimeDescription,
            required: true,
            error: errors.regimeDescription,
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
            Are you sure you want to delete this regime? This action cannot be undone.
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

export default RegimeSetup;