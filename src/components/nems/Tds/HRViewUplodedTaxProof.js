import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { downloadFile, getEmployeeFinancialDetails } from "../../../service/api/nemsService/TdsService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { Toaster } from "../../../common/alertComponets/Toaster";

const HRViewUplodedTaxProof = ({ openDialog, handleClose, selectedSubsection }) => {
  const [preExistingFiles, setPreExistingFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { employeeData } = useContext(EmployeeDataContext);

  useEffect(() => {
    if (!openDialog) return;

    const fetchFinancialDetails = async () => {
      setIsLoading(true);
      try {
        const { success, data } = await getEmployeeFinancialDetails(
          selectedSubsection.employeeCode, selectedSubsection.financialYearCode,
        );

        if (success) {
          const matchedDetail = data.content.find(
            (detail) =>
              detail.tdsSubSectionCode === selectedSubsection?.code &&
              detail.financialYearCode === selectedSubsection?.financialYearCode
          );

          if (matchedDetail) {
            setPreExistingFiles(matchedDetail.tdsProofDetails || []);
          } else {
            setPreExistingFiles([]);
            Toaster("info", "No files found for this subsection.");
          }
        } else {
          Toaster("error", "Failed to load financial details.");
        }
      } catch (error) {
        console.error("Error fetching financial details:", error);
        Toaster("error", "An error occurred while fetching financial details.");
      } finally {
        setIsLoading(false);
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
  return (
    <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Proof Documents for {selectedSubsection?.description}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : preExistingFiles.length > 0 ? (
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
                  <TableRow key={index}>
                    <TableCell>{file.documentPath.split("\\").pop()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleFileDownload(file.documentPath)}>
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No files available for this subsection.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HRViewUplodedTaxProof;
