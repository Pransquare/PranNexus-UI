import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import uploadIcon from "../../assets/Images/uploadIcon.png";
import { Toaster } from "../../common/alertComponets/Toaster";
import {
  UploadReleaseNotes,
  SearchReleaseNotes,
  DownloadReleaseNote,
} from "../../service/api/itService/ItService";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const defaultFormData = {
  releaseName: "",
  releaseVersion: "",
  file: null,
  fileName: "",
};

const VersionCheck = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { employeeData } = useContext(EmployeeDataContext);

  const headers = [
    "SNo",
    "Release Name",
    "Release Version",
    "Release Date",
    "Filename",
    "Uploaded By",
    "Action",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = { page: 0, size: 10 };
        const result = await SearchReleaseNotes(searchParams);
        setData(result || []);
      } catch (error) {
        Toaster("error", "Failed to fetch release notes.");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedFormats = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedFormats.includes(file.type)) {
      Toaster(
        "error",
        "Only Excel (.xlsx, .xls) and Word (.docx, .doc) files are allowed."
      );
      return;
    }

    if (!formData.releaseName || !formData.releaseVersion) {
      Toaster(
        "error",
        "Please enter Release Name and Release Version before uploading a file."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file,
      fileName: file.name,
    }));

    try {
      const releaseDate = new Date().toISOString().split("T")[0];

      await UploadReleaseNotes(
        file,
        formData.releaseName,
        formData.releaseVersion,
        releaseDate,
        employeeData?.firstName
      );
      Toaster("success", "File uploaded successfully!");
    } catch (error) {
      Toaster("error", "Failed to upload file.");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = useCallback(async () => {
    if (!formData.releaseName || !formData.releaseVersion) {
      Toaster("error", "Release Name and Release Version are required.");
      return;
    }

    try {
      const searchParams = {
        releaseName: formData.releaseName,
        fileName: formData.fileName,
        page: 0,
        size: 10,
      };

      const result = await SearchReleaseNotes(searchParams);

      if (result && result.length > 0) {
        setData(result);
        setFormData(defaultFormData);
        Toaster("success", "Submitted Successfully!");
      } else {
        Toaster("info", "No records found.");
        setData([]);
      }
    } catch (error) {
      Toaster("error", "Failed to search release notes.");
    }
  }, [formData]);

  const handleReset = () => {
    setFormData(defaultFormData);
    // setData([]);
  };

  const handleDownload = async (fileName) => {
    if (!fileName) {
      Toaster("error", "Invalid file name.");
      return;
    }

    const response = await DownloadReleaseNote(fileName);

    if (response.success) {
      Toaster("success", "File downloaded successfully.");
    } else {
      Toaster("error", response.message || "Failed to download file.");
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="left" gutterBottom>
          Release Notes Management
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Release Name"
              name="releaseName"
              value={formData.releaseName}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Release Version"
              name="releaseVersion"
              value={formData.releaseVersion}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              label="Filename"
              value={formData.fileName}
              InputProps={{ readOnly: true }}
            />
            <input
              accept=".xls,.xlsx,.doc,.docx"
              style={{ display: "none" }}
              id="upload-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-button-file">
              <IconButton component="span">
                <img
                  src={uploadIcon}
                  alt="Upload File"
                  style={{ width: "35px", height: "35px", marginLeft: "10px" }}
                />
              </IconButton>
            </label>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReset}
            sx={{ marginRight: 2 }}
          >
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>

        <Box sx={{ marginTop: 3 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{row.releaseName}</TableCell>
                        <TableCell>{row.releaseVersion}</TableCell>
                        <TableCell>{row.releaseDate || "N/A"}</TableCell>
                        <TableCell>{row.fileName}</TableCell>
                        <TableCell>{row.createdBy}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleDownload(row.fileName)}
                          >
                            <CloudDownload />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default VersionCheck;
