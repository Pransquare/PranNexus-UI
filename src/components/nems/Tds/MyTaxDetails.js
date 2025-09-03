import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  getBySectionCodes,
  getConfigByFinancialYearCode,
  getFinancialYear,
  SaveTdsDetails,
  getEmployeeFinancialDetails,
  updateTdsStatus,
} from "../../../service/api/nemsService/TdsService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import TaxApprovedDetails from "../../nems/Tds/TaxApprovedDetails";
import { UserManagentCheck } from "../../../common/UserManagement";
import { CloudUploadOutlined } from "@mui/icons-material";
import UploadPermissionManagement from "./UploadPermissionManagement";
import UploadTaxProof from "./UploadTaxProof";
import { GetEmployeeByEmployeeCode } from "../../../service/api/nemsService/EmployeeService";
import TdsDeclarationPermissionManagement from "./TdsDeclarationPermissionManagement";

function MyTaxDetails() {
  const [tabsValue, setTabsValue] = useState(0);
  const [financialYear, setFinancialYear] = useState("");
  const [financialYearCode, setFinancialYearCode] = useState("");
  const [sectionsData, setSectionsData] = useState([]);
  const [errors, setErrors] = useState({});
  const [regimeOptions, setRegimeOptions] = useState([]);
  const [formData, setFormData] = useState({
    taxRegime: "",
    regimeCodeDescription: "",
  });
  const { employeeData } = useContext(EmployeeDataContext);
  const [TaxdeclarationEnabled, setTaxdeclarationEnabled] = useState(false);
  const [isTdsFetched, setIsTdsFetched] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const navigate = useNavigate();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedSubsection, setSelectedSubsection] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [hideAllSubmits, setHideAllSubmits] = useState(false);
  const [showHRDialog, setShowHRDialog] = useState(false);
  const formatAmount = (amount) => {
    if (isNaN(amount) || amount === "") return "";
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
      Number(amount)
    );
  };
  const tabList = [];
  if (UserManagentCheck("tds_employee") && !employeeData?.genericProfile ) {
    tabList.push({ label: "Employee Tax Declaration Entry" });
  }
  if (UserManagentCheck("hr_tools_tax_approved_Details")) {
    tabList.push({ label: "Tax Approval Dashboard" });
    tabList.push({ label: "Tax Declaration Permission Management" });
    tabList.push({ label: "Tax Upload Permission Management" });
  }

  useEffect(() => {
    fetchFinancialYearConfig();
    fetchEmployeeDetails();
  }, []);
  useEffect(() => {
    if (
      employeeDetails?.isTaxdeclarationEnabled === 0 ||
      employeeDetails?.isTaxdeclarationEnabled === null
    ) {
      setShowHRDialog(true); // Show dialog if Tax Declaration is disabled
    }
  }, [employeeDetails]);

  const fetchEmployeeDetails = async () => {
    try {
      // Simulate fetching employee details
      const response = await GetEmployeeByEmployeeCode(
        employeeData?.employeeCode
      );
      setEmployeeDetails(response);
      setTaxdeclarationEnabled(response?.isTaxdeclarationEnabled);
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
    }
  };

  useEffect(() => {
    if (employeeData?.employeeCode) {
      setCreatedBy(employeeData?.emailId || "");
      setTaxdeclarationEnabled(employeeDetails?.isTaxdeclarationEnabled);
      if (sectionsData.length > 0 && !isTdsFetched) {
        fetchTdsDetails(employeeData?.employeeCode);
      }
      if (TaxdeclarationEnabled === 0 || TaxdeclarationEnabled === null) {
        bindTaxRegimeFromResponse(employeeData?.employeeCode);
      }
    }
  }, [employeeData, sectionsData, isTdsFetched]);

  const handleOpenUploadDialog = (sectionIndex, subsectionIndex) => {
    if (employeeDetails.isProofdeclarationEnabled === 1) {
      const selectedSubsection = {
        ...sectionsData[sectionIndex].subsections[subsectionIndex],
        financialYearCode,
      };
      setSelectedSubsection(selectedSubsection);
      setIsUploadDialogOpen(true);
    } else {
      setAlertOpen(true);
    }
  };
  const handleCloseAlert = () => setAlertOpen(false);

  const fetchFinancialYearConfig = async () => {
    try {
      const financialYears = await getFinancialYear();
      if (financialYears.length > 0) {
        const latestYear = financialYears[0];
        setFinancialYear(latestYear.financialYear);
        setFinancialYearCode(latestYear.code);

        const config = await getConfigByFinancialYearCode(latestYear.code);
        const uniqueRegimes = Array.from(
          new Map(
            config.map((item) => [
              item.regimeCode,
              {
                code: item.regimeCode,
                description: item.regime.regimeDescription,
              },
            ])
          ).values()
        );
        setRegimeOptions(uniqueRegimes);

        const sectionCodes = config.map((item) => item.sectionCode);
        const payload = { sectionCodes };
        const sectionDataResponse = await getBySectionCodes(payload);

        const groupedSections = sectionDataResponse.reduce((acc, item) => {
          const { sectionCode, section, subsection } = item;
          if (!acc[sectionCode]) {
            acc[sectionCode] = {
              sectionCode,
              sectionDescription: section.description,
              subsections: [],
            };
          }
          acc[sectionCode].subsections.push({
            code: subsection.code,
            description: subsection.description,
          });
          return acc;
        }, {});

        setSectionsData(Object.values(groupedSections));
      }
    } catch (error) {
      Toaster("error", "Failed to load financial year configuration.");
    }
  };

  const bindTaxRegimeFromResponse = async (employeeCode) => {
    try {
      const response = await getEmployeeFinancialDetails(
        employeeCode,
        financialYearCode
      );
      if (response.success && response.data.content.length > 0) {
        const regimeCodeDescription =
          response.data.content[0]?.regimeCodeDescription || "";
        const regimeCode = response.data.content[0]?.regimeCode || "";
        setFormData((prev) => ({
          ...prev,
          taxRegime: regimeCode,
          regimeCodeDescription,
        }));
      }
    } catch (error) {
      console.error("Error binding tax regime description:", error);
    }
  };

  const fetchTdsDetails = async (employeeCode) => {
    try {
      const response = await getEmployeeFinancialDetails(
        employeeCode,
        financialYearCode
      );
      if (response.success) {
        const tdsDetails = response.data.content;

        if (!(response.data.content[0]?.status === "126")) {
          setHideAllSubmits(true);
        } else {
          setHideAllSubmits(false);
        }

        const updatedSections = sectionsData.map((section) => ({
          ...section,
          subsections: section.subsections.map((subsection) => {
            const matchingDetail = tdsDetails.find(
              (detail) =>
                detail.tdsSectionCode === section.sectionCode &&
                detail.tdsSubSectionCode === subsection.code
            );

            return {
              ...subsection,
              declaredValue: matchingDetail?.declaredValue || "",
              approvedValue: matchingDetail?.approvedValue || "",
            };
          }),
        }));

        setSectionsData(updatedSections);
        setIsTdsFetched(true);
      }
    } catch (error) {
      console.error("Error fetching TDS details:", error);
      Toaster("error", "Failed to fetch TDS details.");
    }
  };

  const handleRegimeChange = (e) => {
    const selectedRegime = e.target.value;
    const selectedRegimeDescription = regimeOptions.find(
      (option) => option.code === selectedRegime
    )?.description;
    setFormData((prev) => ({
      ...prev,
      taxRegime: selectedRegime,
      regimeCodeDescription: selectedRegimeDescription,
    }));
  };

  const handleChange = (e, sectionIndex, subsectionIndex) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (isNaN(rawValue) || Number(rawValue) < 0) {
      setErrors((prev) => ({
        ...prev,
        [`${sectionIndex}-${subsectionIndex}`]:
          "Declaration Amount cannot be empty or negative.",
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
                  ? { ...subsection, declaredValue: rawValue }
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

  const handleSubmit = async () => {
    const validationErrors = {};
    sectionsData.forEach((section, sectionIndex) => {
      section.subsections.forEach((subsection, subsectionIndex) => {
        if (!subsection.declaredValue || Number(subsection.declaredValue) < 0) {
          validationErrors[`${sectionIndex}-${subsectionIndex}`] =
            "Declaration Amount cannot be empty or negative.";
        }
      });
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Toaster("error", "Please fix the errors before submitting.");
      return;
    }

    try {
      const payload = sectionsData.flatMap((section) =>
        section.subsections.map((subsection) => ({
          id: 0,
          regimeCode: formData.taxRegime || "",
          tdsSectionCode: section.sectionCode || "",
          tdsSubSectionCode: subsection.code || "",
          declaredValue: subsection.declaredValue.toString().replace(/,/g, ""),
          approvedValue:
            TaxdeclarationEnabled === 1
              ? subsection.declaredValue.toString().replace(/,/g, "")
              : "",
          createdBy,
          createdDate: new Date().toISOString(),
          modifiedBy: createdBy,
          modifiedDate: new Date().toISOString(),
          status: "125",
          employeeCode: employeeData?.employeeCode || "",
          financialYearCode: financialYearCode,
        }))
      );

      const response = await SaveTdsDetails(payload);
      if (response.success) {
        Toaster("success", "TDS details saved successfully!");
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (error) {
      console.error("Error saving TDS details:", error);
      Toaster("error", "An error occurred while saving TDS details.");
    }
  };

  const handleSubmitUploadedFiles = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    callSubmitUploadedFilesAPI();
  };

  const callSubmitUploadedFilesAPI = async () => {
    try {
      const employeeCode = employeeData?.employeeCode;
      const status = "127";
      const result = await updateTdsStatus(employeeCode, status);

      if (result.success) {
        Toaster("success", "TDS status updated successfully.");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        Toaster("error", "Error updating TDS status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating TDS status:", error);
      Toaster("error", "An error occurred while updating the status.");
    }
  };
  const handleTabChange = (e, newValue) => {
    setTabsValue(newValue);
  };
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <Tabs value={tabsValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        {tabList.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabList[tabsValue]?.label === "Employee Tax Declaration Entry" && (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Financial Year: {financialYear}
          </Typography>
          <FormControl
            fullWidth
            sx={{ mb: 3 }}
            disabled={
              TaxdeclarationEnabled === 0 || TaxdeclarationEnabled === null
            }
          >
            <InputLabel id="tax-regime-label">Tax Regime</InputLabel>
            <Select
              labelId="tax-regime-label"
              value={formData.taxRegime}
              onChange={handleRegimeChange}
              label="Tax Regime"
            >
              {regimeOptions.map((regime) => (
                <MenuItem key={regime.code} value={regime.code}>
                  {regime.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                      <TableCell sx={{ width: "250px" }}>
                        Declared Amount
                      </TableCell>
                      <TableCell sx={{ width: "150px" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {section.subsections.map((subsection, subsectionIndex) => (
                      <TableRow key={subsectionIndex}>
                        <TableCell>{subsection.description}</TableCell>
                        <TableCell>
                          <TextField
                            value={formatAmount(subsection.declaredValue)}
                            onChange={(e) =>
                              handleChange(e, sectionIndex, subsectionIndex)
                            }
                            type="text"
                            size="small"
                            sx={{ width: "250px" }}
                            disabled={
                              TaxdeclarationEnabled === 0 ||
                              TaxdeclarationEnabled === null
                            }
                            error={
                              !!errors[`${sectionIndex}-${subsectionIndex}`]
                            }
                            helperText={
                              errors[`${sectionIndex}-${subsectionIndex}`] || ""
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
          {TaxdeclarationEnabled !== 0 && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ mt: 3 }}
            >
              Submit
            </Button>
          )}
          {employeeDetails.isProofdeclarationEnabled === 1 &&
            !hideAllSubmits && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitUploadedFiles}
                sx={{ mt: 3 }}
              >
                Submit Uploaded Files
              </Button>
            )}
        </>
      )}

      {tabList[tabsValue]?.label === "Tax Approval Dashboard" && (
        <TaxApprovedDetails />
      )}

      {tabList[tabsValue]?.label ===
        "Tax Declaration Permission Management" && (
        <TdsDeclarationPermissionManagement />
      )}

      {tabList[tabsValue]?.label === "Tax Upload Permission Management" && (
        <UploadPermissionManagement />
      )}

      <UploadTaxProof
        openDialog={isUploadDialogOpen}
        handleClose={() => setIsUploadDialogOpen(false)}
        selectedSubsection={selectedSubsection}
      />

      <Dialog open={alertOpen} onClose={handleCloseAlert}>
        <DialogTitle>Upload Not Allowed</DialogTitle>
        <DialogContent>
          <Typography>
            Please contact HR to enable proof declaration for this section.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit the uploaded files? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmationDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for HR Contact Message */}
      {UserManagentCheck("tds_employee") && (
        <Dialog open={showHRDialog} onClose={() => setShowHRDialog(false)}>
          <DialogTitle>Tax Declaration Disabled</DialogTitle>
          <DialogContent>
            <Typography>
              Please contact HR to enable Tax Declaration for your account.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowHRDialog(false)}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default MyTaxDetails;
