import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  deleteFinancialYear,
  getFinancialYear,
  saveFinancialYear,
  updateFinancialYear,
} from "../../../service/api/emsService/TdsService";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RegimeSetup from "./RegimeSetup";
import SectionSetup from "./SectionsSetup";
import SubSectionsSetup from "./SubSectionssSetup";
import SecSubSecSetup from "./SecSubSectionSetup";
import TdsConfiguration from "../../ems/Tds/TdsConfiguration";

function FinancialYearSetup() {
  const [tabsValue, setTabsValue] = useState(0);
  const [formData, setFormData] = useState({
    financialCode: "",
    startYear: null,
    endYear: null,
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFinancialYear();
        if (Array.isArray(response)) {
          setData(response);
          setTotalCount(response.length);
        } else {
          setData([]); 
          Toaster("error", "Invalid data format received");
        }
      } catch (error) {
        Toaster("error", "Failed to load financial year data");
      }
    };
    fetchData();
  }, []);  

  const handleTabChange = (event, newValue) => {
    setTabsValue(newValue);
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

  const handleStartYearChange = (newValue) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      startYear: newValue ? "" : "Start Year is required",
      endYear: "",
    }));
    setFormData((prev) => ({
      ...prev,
      startYear: newValue,
      endYear: newValue ? newValue.add(1, "year") : null,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      financialCode: formData.financialCode === "" ? "Financial Code is required" : "",
      startYear: formData.startYear === null ? "Start Year is required" : "",
      endYear: formData.endYear === null ? "End Year is required" : "",
    };
    setErrors(newErrors);
  
    if (Object.values(newErrors).every((error) => error === "")) {
      const financialYear = `${formData.startYear.year()}-${formData.endYear.year()}`;
      const payload = {
        id: isEditing ? data[editIndex]?.id : 0,
        financialYear,
        code: formData.financialCode,
        status: "Active",
      };
  
      try {
        let response;
        if (isEditing) {
          response = await updateFinancialYear(payload);
        } else {
          response = await saveFinancialYear(payload);
        }
  
        if (response.success) {
          const newData = {
            id: response.data.id,
            financialYear: response.data.financialYear,
            code: response.data.code,
            status: response.data.status,
          };
  
          if (isEditing) {
            const updatedData = [...data];
            updatedData[editIndex] = newData;
            setData(updatedData);
            Toaster("success", "Financial year updated successfully");
          } else {
            setData([...data, newData]);
            Toaster("success", "Financial year added successfully");
          }
          handleReset();
        } else {
          Toaster("error", response.message || "Failed to save financial year");
        }
      } catch (error) {
        Toaster("error", "An error occurred while saving financial year");
      }
    }
  };
  

  const handleReset = () => {
    setFormData({
      financialCode: "",
      startYear: null,
      endYear: null,
    });
    setErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = useCallback((rowData, index) => {
    setFormData({
      financialCode: rowData.code,
      startYear: dayjs(rowData.financialYear.split("-")[0], "YYYY"),
      endYear: dayjs(rowData.financialYear.split("-")[1], "YYYY"),
    });
    setIsEditing(true);
    setEditIndex(index);
  }, []);

  const confirmDelete = useCallback((index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const financialYearId = data[deleteIndex]?.id;

    if (!financialYearId) {
      Toaster("error", "Invalid financial year ID");
      setDeleteDialogOpen(false);
      return;
    }

    try {
      const response = await deleteFinancialYear(financialYearId);

      if (response.success) {
        const updatedData = data.filter((_, i) => i !== deleteIndex);
        setData(updatedData);
        Toaster("success", "Financial year deleted successfully");
      } else {
        Toaster("error", response.message || "Failed to delete financial year");
      }
    } catch (error) {
      Toaster("error", "An error occurred while deleting financial year");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  }, [deleteIndex, data]);

  const headers = ["Financial Code", "Financial Year", "Status", "Actions"];

  const contentConfig = {
    actions: {
      edit: true,
      delete: true,
    },
    content: Array.isArray(data)
      ? data.map((row, index) => [
          { value: row.code, isPrint: true },
          { value: row.financialYear, isPrint: true },
          { value: row.status, isPrint: true },
          {
            forAction: true,
            value: row,
            customActions: null,
          },
        ])
      : [],
  };
  

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
        <Tab label="Financial Year Setup" value={0} />
        <Tab label="Regimes Setup" value={1} />
        <Tab label="Sections Setup" value={2} />
        <Tab label="Sub-Sections Setup" value={3} />
        <Tab label="Sec-Sub-Sections Setup" value={4} />
        <Tab label="Tax details Config" value={5} />
      </Tabs>
      <Box sx={{ p: 2 }}>
        {tabsValue === 0 && (
          <>
            <ConfigureForm
              data={[
                {
                  type: "text",
                  name: "financialCode",
                  label: "Financial Code",
                  value: formData.financialCode,
                  required: true,
                  error: errors.financialCode,
                },
                {
                  type: "custom",
                  name: "startYear",
                  label: "Start Year",
                  component: (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={["year"]}
                        label="Start Year"
                        value={formData.startYear}
                        onChange={handleStartYearChange}
                        disableFuture
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            required
                            error={!!errors.startYear}
                            helperText={errors.startYear}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  ),
                },
                {
                  type: "custom",
                  name: "endYear",
                  label: "End Year",
                  component: (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={["year"]}
                        label="End Year"
                        value={formData.endYear}
                        disabled
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            required
                            error={!!errors.endYear}
                            helperText={errors.endYear || "Must be after the start year"}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  ),
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
          </>
        )}
        {tabsValue === 1 && <RegimeSetup />}
        {tabsValue === 2 && <SectionSetup />}
        {tabsValue === 3 && <SubSectionsSetup />}
        {tabsValue === 4 && <SecSubSecSetup />}
        {tabsValue === 5 && <TdsConfiguration />}
      </Box>

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
            Are you sure you want to delete this financial year? This action cannot be undone.
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

export default FinancialYearSetup;
