import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { Toaster } from "../../common/alertComponets/Toaster";
import {
  SearchReleaseNotes,
  DownloadReleaseNote,
} from "../../service/api/itService/ItService";

const headers = [
  "SNo",
  "Release Name",
  "Release Version",
  "Release Date",
  "File Name",
  "Action",
];
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle null or empty date
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // Converts to "DD/MM/YYYY"
};

const ReleaseNoteView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = { page: 0, size: 50 }; // Fetch more records
        const result = await SearchReleaseNotes(searchParams);
        setData(result || []);
      } catch (error) {
        Toaster("error", "Failed to fetch release notes.");
      }
    };

    fetchData();
  }, []);

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
          Release Notes
        </Typography>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
                data.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.releaseName}</TableCell>
                    <TableCell>{row.releaseVersion}</TableCell>
                    <TableCell>{formatDate(row.releaseDate)}</TableCell>
                    <TableCell>
                      {row.fileName ? (
                        <Typography
                          variant="body2"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {row.fileName}
                        </Typography>
                      ) : (
                        "No File"
                      )}
                    </TableCell>
                    <TableCell>
                      {row.fileName ? (
                        <IconButton
                          color="primary"
                          onClick={() => handleDownload(row.fileName)}
                        >
                          <CloudDownload />
                        </IconButton>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Release Notes Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ReleaseNoteView;
