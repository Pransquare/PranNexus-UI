import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Pagination,
} from "@mui/material";
import ConfigTable from "../../../../common/customComponents/ConfigTable";
import {
  DownloadVendorReport,
  SearchVendor,
} from "../../../../service/api/emsService/VendorService";
import { Toaster } from "../../../../common/alertComponets/Toaster";

const VendorSearch = () => {
  const [searchFields, setSearchFields] = useState({
    vendorName: "",
    client: "",
    resource: "",
    vendorStatus: "",
  });

  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleInputChange = (e) => {
    setSearchFields({ ...searchFields, [e.target.name]: e.target.value });
  };

  const fetchData = async (pageNumber = 1) => {
    try {
      const payload = {
        vendorName: searchFields.vendorName || "",
        client: searchFields.client || "",
        resource: searchFields.resource || "",
        vendorStatus: searchFields.vendorStatus || "",
        workflowStatuses: ["101", "102", "103"],
        page: pageNumber - 1,
        size: 5,
        startDate: "",
        endDate: "",
      };

      const response = await SearchVendor(payload);
      setFilteredData(response?.content || []);
      setTotalPages(response?.totalPages || 0);
    } catch (error) {
      Toaster("error", "Failed to fetch vendors.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    fetchData(1);
    setPage(1);
  };

  const handleReset = () => {
    setSearchFields({
      vendorName: "",
      client: "",
      resource: "",
      vendorStatus: "",
    });
    fetchData(1);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
    fetchData(value);
  };

  const tableData = {
    content: filteredData.map((vendor) => [
      { value: vendor.vendorName, isPrint: true, forAction: false },
      { value: vendor.client, isPrint: true, forAction: false },
      { value: vendor.resource, isPrint: true, forAction: false },
      { value: vendor.contractType, isPrint: true, forAction: false },
      {
        value: `$${vendor.clientRate ?? vendor.clientRatePerHour}`,
        isPrint: true,
        forAction: false,
      },
      {
        value: `$${vendor.ssitRate ?? vendor.ssItRatePerHour}`,
        isPrint: true,
        forAction: false,
      },
      {
        value: `${vendor.rateMargin ?? vendor.rateMarginPerHour}%`,
        isPrint: true,
        forAction: false,
      },
      {
        value: vendor.status?.description || "N/A", // workflowStatus
        isPrint: true,
        forAction: false,
      },
      {
        value: vendor.vendorStatus || "N/A", // vendorStatus
        isPrint: true,
        forAction: false,
      },
    ]),
  };

  const handleDownload = async () => {
    if (filteredData.length === 0) {
      Toaster("info", "No data to download.");
      return;
    }

    const firstMatch = filteredData[0];

    const downloadParams = {
      vendorName: searchFields.vendorName || null,
      client: searchFields.client || null,
      resource: searchFields.resource || null,
      vendorStatus: searchFields.vendorStatus || null,
      workflowStatuses: ["101", "102", "103"],
      managerId: firstMatch?.managerId ?? 0,
      page: 0,
      size: 100,
      startDate: firstMatch?.startDate || null,
      endDate: firstMatch?.endDate || null,
    };

    try {
      await DownloadVendorReport(downloadParams);
      Toaster("success", "Vendor report downloaded.");
    } catch {
      Toaster("error", "Failed to download vendor report.");
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h6" color="primary">
        Vendor Search
      </Typography>

      {/* Search Form */}
      <Box
        sx={{
          padding: 2,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          marginTop: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Vendor Name"
              name="vendorName"
              value={searchFields.vendorName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Client"
              name="client"
              value={searchFields.client}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Resource"
              name="resource"
              value={searchFields.resource}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              label="Status"
              name="vendorStatus"
              value={searchFields.vendorStatus}
              onChange={handleInputChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid
          container
          justifyContent="flex-end"
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownload}
            >
              Download Report
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="warning" onClick={handleReset}>
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Result Table */}
      <Box
        sx={{
          padding: 2,
          marginTop: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
        }}
      >
        {filteredData.length > 0 ? (
          <>
            <ConfigTable
              data={tableData}
              headers={[
                "Vendor Name",
                "Client",
                "Resource",
                "Contract Type",
                "Client Rate",
                "SSIT Rate",
                "Rate Margin",
                "Workflow Status",
                "Status",
              ]}
              selectionTable={false}
              pagination={false}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "red" }}>
            No matching vendors found
          </p>
        )}
      </Box>
    </Box>
  );
};

export default VendorSearch;
