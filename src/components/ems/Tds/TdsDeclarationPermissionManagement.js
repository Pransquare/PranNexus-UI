import React, { useState } from 'react'
import { GetEmployeesByName } from '../../../service/api/emsService/EmployeeService';
import { Toaster } from '../../../common/alertComponets/Toaster';
import { Box } from '@mui/system';
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { enableTaxDeclarationForAllActiveEmployees, enableTaxDeclarationForEmployee } from '../../../service/api/emsService/TdsService';


const TdsDeclarationPermissionManagement = () => {
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
    const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState(null); // Action to perform after confirmation
  
    // Function to handle employee search
    const handleEmployeeSearch = async (searchTerm) => {
      if (searchTerm.length >= 2) {
        setLoadingEmployees(true);
        try {
          const data = await GetEmployeesByName(searchTerm);
          setEmployeeSuggestions(data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        } finally {
          setLoadingEmployees(false);
        }
      } else {
        setEmployeeSuggestions([]);
      }
    };
  
    // Open dialog for individual upload permission
    const handleUploadPermissionIndividual = () => {
      if (selectedEmployee) {
        setDialogAction("individual");
        setOpenDialog(true);
      } else {
        Toaster("error", "Please select an employee.");
      }
    };
  
    // Open dialog for all employees upload permission
    const handleUploadPermissionAll = () => {
      setDialogAction("all");
      setOpenDialog(true);
    };
  
    // Handle dialog confirmation
    const handleDialogConfirm = async () => {
      if (dialogAction === "individual" && selectedEmployee) {
        try {
          // Call the service function to enable proof declaration for individual employee
          const response = await enableTaxDeclarationForEmployee(selectedEmployee.employeeCode);
          if (response.success) {
            Toaster("success", `Upload permission granted for ${selectedEmployee.fullName}.`);
          } else {
            Toaster("error", response.message);
          }
        } catch (error) {
          Toaster("error", "Error enabling proof declaration.");
        }
      } else if (dialogAction === "all") {
        try {
          // Call the service function to enable proof declaration for all active employees
          const response = await enableTaxDeclarationForAllActiveEmployees
          if (response.success) {
            Toaster("success", "Upload permission granted for all employees.");
          } else {
            Toaster("error", response.message);
          }
        } catch (error) {
          Toaster("error", "Error enabling proof declaration for all employees.");
        }
      }
      setOpenDialog(false); // Close dialog after action
    };
  
    // Handle dialog cancel action
    const handleDialogCancel = () => {
      setOpenDialog(false);
    };
  
    return (
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          <Box sx={{ width: '400px' }}>
            <Autocomplete
              options={employeeSuggestions}
              getOptionLabel={(option) =>
                `${option.fullName} (${option.employeeCode})`
              }
              loading={loadingEmployees}
              onInputChange={(event, value) => {
                setEmployeeSearchTerm(value);
                handleEmployeeSearch(value);
              }}
              onChange={(event, value) => {
                setSelectedEmployee(value || null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Employee by Name (Full Name / Code)"
                  placeholder="Search by Name"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    '& .MuiInputLabel-root': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>
  
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadPermissionIndividual}
          >
            Enable TDS Permission for Individual
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUploadPermissionAll}
          >
            Enable TDS Permission for All
          </Button>
        </Box>
  
        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleDialogCancel}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            {dialogAction === "individual" && selectedEmployee && (
              <Typography>
                Are you sure you want to enable proof declaration for{" "}
                {selectedEmployee.fullName}?
              </Typography>
            )}
            {dialogAction === "all" && (
              <Typography>
                Are you sure you want to enable proof declaration for all active
                employees?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
export default TdsDeclarationPermissionManagement