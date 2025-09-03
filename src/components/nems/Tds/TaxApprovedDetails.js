import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Autocomplete,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  getEmployeeFinancialDetails,
  getFinancialYear,
  updateTdsDetails,
} from "../../../service/api/nemsService/TdsService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { GetEmployeesByName } from "../../../service/api/nemsService/EmployeeService";
import { CloudUploadOutlined } from "@mui/icons-material";
import HRViewUplodedTaxProof from "./HRViewUplodedTaxProof";

function TaxApprovedDetails() {
  const [sectionsData, setSectionsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [employeesData, setEmployeesData] = useState([]);
  const [employeeCode, setEmployeeCode] = useState("");
  const [financialYearCode, setFinancialYearCode] = useState("");
  const [financialYearDescription, setFinancialYearDescription] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedSubsection, setSelectedSubsection] = useState(null);

  const { employeeData } = useContext(EmployeeDataContext);

  const formatAmount = (amount) => {
    if (isNaN(amount) || amount === "") return "";
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
      Number(amount)
    );
  };

  const removeComma = (amount) => amount.replace(/,/g, "");

  useEffect(() => {
    const initialize = async () => {
      await fetchFinancialYear();
      await fetchEmployeeList();
      setIsLoading(false);
    };
    initialize();
  }, []);
  const handleOpenUploadDialog = (sectionIndex, subsectionIndex) => {
    const subsection = sectionsData[sectionIndex].subsections[subsectionIndex];

    setSelectedSubsection({
      ...subsection,
      employeeCode: employeeCode,
      sectionCode: sectionsData[sectionIndex].sectionCode,
    });

    setIsUploadDialogOpen(true);
  };

  const handleFileUpload = async (file) => {
    const selectedSection = sectionsData[currentSectionIndex];
    const selectedSubsection =
      selectedSection.subsections[currentSubsectionIndex];

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("employeeCode", employeeCode);
      formData.append("sectionCode", selectedSection.sectionCode);
      formData.append("subsectionCode", selectedSubsection.code);

      // Replace with actual API call for file upload
      const response = await axios.post("/api/upload-proof", formData);

      if (response.data.success) {
        Toaster("success", "File uploaded successfully!");
        setUploadDialogOpen(false);
      } else {
        Toaster("error", "File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Toaster("error", "Error uploading file. Please try again.");
    }
  };

  const fetchFinancialYear = async () => {
    try {
      const response = await getFinancialYear();
      if (response && Array.isArray(response)) {
        const sortedYears = response.sort((a, b) =>
          b.financialYear.localeCompare(a.financialYear)
        );
        setFinancialYearCode(sortedYears[0].code);
        setFinancialYearDescription(sortedYears[0].financialYear);
      } else {
        Toaster("error", "Invalid response format from financial year API.");
      }
    } catch (error) {
      Toaster("error", "Error fetching financial year details.");
    }
  };

  const fetchEmployeeList = async () => {
    try {
      const response = await getEmployeeFinancialDetails(
        null,
        financialYearCode
      );
      if (response.success) {
        setEmployeesData(response.data.content);
      } else {
        Toaster("error", "Failed to fetch employee financial details.");
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  const fetchEmployeeDetails = async (code) => {
    try {
      setSectionsData([]);
      const response = await getEmployeeFinancialDetails(
        code,
        financialYearCode
      );
      if (response.success) {
        const groupedSections = response.data.content.reduce((acc, detail) => {
          const {
            tdsSectionCode,
            tdsSectionDescription,
            tdsSubSectionCode,
            tdsSubSectionDescription,
            declaredValue,
            approvedValue,
            regimeCode,
            financialYearCode,
            id,
            status,
            tdsProofDetails,
          } = detail;

          if (!acc[tdsSectionCode]) {
            acc[tdsSectionCode] = {
              sectionCode: tdsSectionCode,
              sectionDescription: tdsSectionDescription,
              subsections: [],
            };
          }

          acc[tdsSectionCode].subsections.push({
            code: tdsSubSectionCode,
            description: tdsSubSectionDescription,
            declarationAmount: formatAmount(declaredValue || 0),
            proofAmount: formatAmount(approvedValue || 0),
            regimeCode,
            financialYearCode,
            id: id || 0,
            status,
            tdsProofDetails: tdsProofDetails || [],
          });

          return acc;
        }, {});

        setSectionsData(Object.values(groupedSections));
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleSearch = () => {
    if (employeeCode) {
      fetchEmployeeDetails(employeeCode);
    } else {
      Toaster("error", "Please select a valid Employee.");
    }
  };

  const handleEmployeeClick = (code) => {
    setEmployeeCode(code);
    fetchEmployeeDetails(code);
  };

  const handleChange = (e, sectionIndex, subsectionIndex) => {
    const rawValue = removeComma(e.target.value);

    if (isNaN(rawValue) || Number(rawValue) < 0) {
      setErrors((prev) => ({
        ...prev,
        [`${sectionIndex}-${subsectionIndex}`]:
          "Approved Amount cannot be empty or negative.",
      }));
      return;
    }

    setSectionsData((prevSections) =>
      prevSections.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              subsections: section.subsections.map((subsection, subIdx) =>
                subIdx === subsectionIndex
                  ? { ...subsection, proofAmount: formatAmount(rawValue) }
                  : subsection
              ),
            }
          : section
      )
    );

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${sectionIndex}-${subsectionIndex}`];
      return newErrors;
    });
  };

  const handleReturn = () => {
    setConfirmationOpen(true);
  };

  const confirmReturn = () => {
    setSectionsData([]);
    setShowDetails(false);
    setConfirmationOpen(false);
    setEmployeeCode("");
    setEmployeeSearchTerm("");
    setEmployeeSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      const allDetailsApproved = sectionsData.every((section) =>
        section.subsections.every(
          (subsection) => Number(subsection.status) === 127
        )
      );

      if (!allDetailsApproved) {
        Toaster(
          "error",
          "All details need to be submitted with uploaded documents by the employee before final approval."
        );
        return;
      }

      const payload = sectionsData.flatMap((section) =>
        section.subsections.map((subsection) => ({
          id: subsection.id,
          regimeCode: subsection.regimeCode,
          financialYearCode: subsection.financialYearCode,
          tdsSectionCode: section.sectionCode,
          tdsSubSectionCode: subsection.code,
          declaredValue: removeComma(subsection.declarationAmount),
          approvedValue: removeComma(subsection.proofAmount),
          createdBy: employeeData?.emailId,
          createdDate: new Date().toISOString(),
          modifiedBy: employeeData?.emailId,
          modifiedDate: new Date().toISOString(),
          status: "102",
          employeeCode: employeeCode,
          tdsProofDetails: subsection.tdsProofDetails || [], // Include proof details
        }))
      );

      const response = await updateTdsDetails(payload);

      if (response.success) {
        Toaster("success", "Tax approved details updated successfully!");
        confirmReturn();
      } else {
        Toaster("error", "Failed to update tax approved details.");
      }
    } catch (error) {
      console.error("Error updating tax approved details:", error);
      Toaster("error", "Failed to update tax approved details.");
    }
  };

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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {!showDetails ? (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 4,
              alignItems: "center",
            }}
          >
            <TextField
              label="Financial Year"
              value={financialYearDescription}
              InputProps={{ readOnly: true }}
              fullWidth
            />
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
                if (value) {
                  setEmployeeCode(value.employeeCode);
                } else {
                  setEmployeeCode("");
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee Name"
                  placeholder="Search by Name"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEmployees ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              fullWidth
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            {sectionsData.map((section, sectionIndex) => (
              <Box key={sectionIndex} sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {section.sectionDescription}
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell sx={{ width: "18%" }}>
                          Declaration Amount
                        </TableCell>
                        <TableCell sx={{ width: "18%" }}>
                          Approved Amount
                        </TableCell>
                        <TableCell sx={{ width: "8%" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.subsections.map(
                        (subsection, subsectionIndex) => (
                          <TableRow key={subsectionIndex}>
                            <TableCell>{subsection.description}</TableCell>
                            <TableCell>
                              <TextField
                                value={subsection.declarationAmount}
                                type="text"
                                size="small"
                                fullWidth
                                InputProps={{
                                  disabled: true,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={subsection.proofAmount}
                                onChange={(e) =>
                                  handleChange(e, sectionIndex, subsectionIndex)
                                }
                                type="text"
                                size="small"
                                fullWidth
                                error={
                                  !!errors[`${sectionIndex}-${subsectionIndex}`]
                                }
                                helperText={
                                  errors[
                                    `${sectionIndex}-${subsectionIndex}`
                                  ] || ""
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  handleOpenUploadDialog(
                                    sectionIndex,
                                    subsectionIndex
                                  )
                                }
                              >
                                <CloudUploadOutlined />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined" onClick={handleReturn}>
              Return
            </Button>
          </Box>
        </>
      )}
      <HRViewUplodedTaxProof
        openDialog={isUploadDialogOpen}
        handleClose={() => setIsUploadDialogOpen(false)}
        selectedSubsection={selectedSubsection}
      />

      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      >
        <DialogTitle>Upload Proof Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please upload the required proof document for the selected
            subsection.
          </DialogContentText>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files.length > 0)
                handleFileUpload(e.target.files[0]);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Navigation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to go back to the search screen? Unsaved
            changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
          <Button onClick={confirmReturn} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TaxApprovedDetails;
