import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { deleteProofDetails, downloadFile, getEmployeeFinancialDetails, saveProofDetails } from "../../../service/api/nemsService/TdsService";
import { UploadExpense } from "../../../service/api/ExpenseService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { Toaster } from "../../../common/alertComponets/Toaster"; // Custom Toaster for alerts

const UploadTaxProof = ({ openDialog, handleClose, selectedSubsection }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFilePaths, setUploadedFilePaths] = useState([]);
  const [preExistingFiles, setPreExistingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [financialDetails, setFinancialDetails] = useState([]);
  const { employeeData } = useContext(EmployeeDataContext);

  const [isFinalSubmission, setIsFinalSubmission] = useState(false);

  useEffect(() => {
    if (!openDialog) return;

    const fetchFinancialDetails = async () => {
      try {
        const { success, data } = await getEmployeeFinancialDetails(
          employeeData?.employeeCode,
          selectedSubsection?.financialYearCode
        );
        if (success) {
          setFinancialDetails(data.content || []);
          const matchedDetail = data.content.find(
            (detail) => detail.tdsSubSectionDescription === selectedSubsection?.description
          );
          setPreExistingFiles(matchedDetail?.tdsProofDetails || []);
          setIsFinalSubmission(!(matchedDetail?.status === "126"));
        } else {
          Toaster("error", "Failed to load financial details.");
        }
      } catch (error) {
        console.error("Error fetching financial details:", error);
        Toaster("error", "An error occurred while fetching financial details.");
      }
    };

    fetchFinancialDetails();
  }, [openDialog, employeeData, selectedSubsection]);
  const handleFileDownload = async (filePath) => {
      try {
        const payload = { filePath };
        const response = await downloadFile(payload);
        if (response.success) {
          // Handle success (e.g., notify user, handle file download)
          // You may want to implement an additional logic to process the response, such as making the file available for download
          window.open(filePath); // Change this based on how the response works
        } else {
          Toaster("error", "Failed to download the file.");
        }
      } catch (error) {
        console.error("Error downloading file:", error);
        Toaster("error", "An error occurred while downloading the file.");
      }
    };
  const getTdsDetailsId = () => {
    const matchedDetail = financialDetails.find(
      (detail) => detail.tdsSubSectionDescription === selectedSubsection?.description
    );
    return matchedDetail?.id || null; 
  };

  const handleFileUpload = async (e) => {
    if (isFinalSubmission) {
      Toaster("warning", "Final submission is complete. You cannot upload new files.");
      return;
    }

    const files = Array.from(e.target.files);
    const tdsDetailsId = getTdsDetailsId();

    if (!tdsDetailsId) {
      Toaster("error", "Unable to associate files with the selected subsection.");
      return;
    }

    setIsUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await UploadExpense(formData, employeeData?.employeeCode);
        const documentPath = response[0];

        setUploadedFiles((prevFiles) => [...prevFiles, file]);
        setUploadedFilePaths((prevPaths) => [
          ...prevPaths,
          { id: 0, tdsDetailsId, documentPath },
        ]);
      }
      Toaster("success", "File(s) uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      Toaster("error", "Failed to upload file(s). Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (index, isPreExisting = false) => {
    if (isFinalSubmission) {
      Toaster("warning", "Final submission is complete. You cannot delete files.");
      return;
    }
  
    if (isPreExisting) {
      const fileToDelete = preExistingFiles[index];
      try {
        const result = await deleteProofDetails(fileToDelete.id); // Call deleteProofDetails API
        if (result.success) {
          setPreExistingFiles((prev) => prev.filter((_, i) => i !== index));
          Toaster("success", "File deleted successfully.");
        } else {
          Toaster("error", result.message || "Failed to delete the file.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        Toaster("error", "An error occurred while deleting the file.");
      }
    } else {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadedFilePaths((prev) => prev.filter((_, i) => i !== index));
      Toaster("success", "File removed successfully.");
    }
  };
  

  const handleSave = async () => {
    if (isFinalSubmission) {
      Toaster("warning", "Final submission is complete. You cannot save changes.");
      return;
    }

    const tdsDetailsId = getTdsDetailsId();

    if (!tdsDetailsId) {
      Toaster("error", "Unable to save files without a valid subsection association.");
      return;
    }

    const payload = [
      ...uploadedFilePaths.map((file) => ({
        id: 0,
        tdsDetailsId,
        documentPath: file.documentPath,
      })),
    ];

    setIsSaving(true);
    try {
      await saveProofDetails(payload);
      Toaster("success", "Files saved successfully!");
      setUploadedFiles([]);
      setUploadedFilePaths([]);
      handleClose();
    } catch (error) {
      console.error("Save Error:", error);
      Toaster("error", "Failed to save file details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Proof Documents</DialogTitle>
      <DialogContent>
        <TextField
          label="Sub Section"
          value={selectedSubsection?.description || ""}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="dense"
        />
        <input
          accept=".jpeg,.jpg,.pdf,.doc,.txt"
          style={{ display: "none" }}
          id="file-upload"
          multiple
          type="file"
          onChange={handleFileUpload}
          disabled={isUploading || isFinalSubmission}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            fullWidth
            disabled={isUploading || isFinalSubmission}
          >
            {isUploading ? <CircularProgress size={20} /> : "Choose Files"}
          </Button>
        </label>
        {isFinalSubmission && (
          <p style={{ color: "red", fontSize: "0.8rem", margin: "8px 0" }}>
            Final submission is complete. You cannot upload or delete files.
          </p>
        )}
        {!isFinalSubmission && (
          <p style={{ color: "red", fontSize: "0.8rem", margin: "8px 0" }}>
          Only JPEG, JPG, PDF, DOC, and TXT files are allowed to upload *
          </p>
        )}
        {(uploadedFiles.length > 0 || preExistingFiles.length > 0) && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preExistingFiles.map((file, index) => (
                  <TableRow key={`pre-${index}`}>
                    <TableCell>{file.documentPath.split("\\").pop()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleFileDownload(file.documentPath)}>
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(index, true)}
                        disabled={isFinalSubmission}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {uploadedFiles.map((file, index) => (
                  <TableRow key={`upload-${index}`}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => window.open(URL.createObjectURL(file))}>
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(index)}
                        disabled={isFinalSubmission}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaving || uploadedFilePaths.length === 0 || isFinalSubmission}
        >
          {isSaving ? <CircularProgress size={24} /> : "Save"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose} disabled={isSaving}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadTaxProof;

