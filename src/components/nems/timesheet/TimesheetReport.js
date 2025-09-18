import React, { useContext, useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Pagination,
  FormHelperText,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { UserManagentCheck } from "../../../common/UserManagement";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeesByName } from "../../../service/api/nemsService/EmployeeService";
import {
  GetTimesheetReport,
  searchAttendanceForGrid,
} from "../../../service/api/nemsService/TimeSheetService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function TimesheetReport() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState({
    dateFrom: null,
    dateTo: null,
    employee: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchedEmployee, setSearchedEmployee] = useState();
  const [gridData, setGridData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value).then(setSearchResults).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "employee") {
      const matched = searchResults.find((emp) => emp.fullName === value);
      if (matched) {
        setSearchedEmployee(matched.employeeCode);
        setSearchResults([]);
      } else if (value.length > 2) {
        setOptions(value);
      } else {
        setSearchedEmployee(null);
        setSearchResults([]);
      }
    }
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setFormData({ dateFrom: null, dateTo: null, employee: "" });
    setSearchedEmployee(null);
    setGridData([]);
    setPage(1);
    setTotalPages(1);
  };

  const fetchGridData = async (newPage = page, size = pageSize) => {
    const { dateFrom, dateTo } = formData;
    if (!dateFrom || !dateTo) {
      Toaster("error", "Please select both dates.");
      return;
    }

    const payload = {
      fromDate: dayjs(dateFrom).format("YYYY-MM-DD"),
      toDate: dayjs(dateTo).format("YYYY-MM-DD"),
      employeeCode: searchedEmployee || employeeData?.employeeCode,
      page: newPage - 1,
      size,
    };

    try {
      const res = await searchAttendanceForGrid(payload);
      setGridData(res?.data || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch {
      Toaster("error", "Failed to fetch attendance data.");
    }
  };

  const downloadReport = () => {
    const { dateFrom, dateTo } = formData;
    if (!dateFrom || !dateTo) {
      Toaster("error", "Please fill in both dates before downloading.");
      return;
    }
    const payload = {
      fromDate: dayjs(dateFrom).format("YYYY-MM-DD"),
      toDate: dayjs(dateTo).format("YYYY-MM-DD"),
      employeeCode: searchedEmployee || employeeData?.employeeCode,
    };

    GetTimesheetReport(payload)
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TimesheetReport.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        Toaster("success", "Timesheet report downloaded successfully.");
      })
      .catch(() => Toaster("error", "Failed to download report."));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    fetchGridData(newPage, pageSize);
  };

  return (
    <Box p={2}>
      <Grid container spacing={2} alignItems="center">
        {UserManagentCheck("hr_tools_nems_timesheet_hr_report") && (
          <Grid item xs={12} sm={4}>
            <Autocomplete
              fullWidth
              freeSolo
              options={searchResults}
              getOptionLabel={(option) =>
                typeof option === "string"
                  ? option
                  : `${option.fullName} (${option.employeeCode})`
              }
              filterOptions={(options, state) =>
                options.filter((opt) =>
                  opt.fullName
                    ?.toLowerCase()
                    .includes(state.inputValue.toLowerCase())
                )
              }
              inputValue={formData.employee}
              onInputChange={(event, newInputValue) => {
                handleChange({
                  target: { name: "employee", value: newInputValue },
                });
              }}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSearchedEmployee(newValue.employeeCode);
                  setFormData((prev) => ({
                    ...prev,
                    employee: newValue.fullName,
                  }));
                  setSearchResults([]);
                }
              }}
              renderOption={(props, option) => (
                <li
                  {...props}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "8px 16px",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{option.fullName}</span>
                  <span style={{ fontSize: "12px", color: "#666" }}>
                    {option.employeeCode} | {option.emailId}
                  </span>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Employee Name" name="employee" />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From Date"
              inputFormat="DD/MM/YYYY"
              value={formData.dateFrom || null}
              onChange={(newValue) => handleDateChange("dateFrom", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  required: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To Date"
              inputFormat="DD/MM/YYYY"
              value={formData.dateTo || null}
              onChange={(newValue) => handleDateChange("dateTo", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  required: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="flex-end"
        spacing={1}
        mt={2}
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="contained"
            onClick={reset}
            sx={{
              backgroundColor: "#ef5350",
              "&:hover": { backgroundColor: "#e53935" },
            }}
          >
            Clear
          </Button>
        </Grid>

        <Grid item>
          <Button variant="contained" onClick={downloadReport}>
            Download
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => fetchGridData()}
            sx={{
              backgroundColor: "rgb(15,168,233)",
              "&:hover": { backgroundColor: "rgb(15,168,233)" },
            }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {gridData.length > 0 && (
        <Box mt={3}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Time Invested</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gridData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {dayjs(row.taskDate).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {row.employeeEntity?.fullName || "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.timeInvested ||
                        `${row.hours || 0}:${row.minutes || 0}`}
                    </TableCell>
                    <TableCell>
                      {row.taskMasterEntity?.taskDescription ||
                        row.taskName ||
                        "N/A"}
                    </TableCell>
                    <TableCell>{row.location || "N/A"}</TableCell>
                    <TableCell>
                      {row.statusMasterEntity?.description || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TimesheetReport;
