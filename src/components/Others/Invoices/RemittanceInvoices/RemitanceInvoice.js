import React from "react";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { panelStyle } from "../../../../common/customStyles/CustomStyles";
import { Description, Receipt, Payment } from "@mui/icons-material";
// import { axiosInstance as axios } from "../../../../service/interceptor/useAxiosInterceptors";
import { Environment } from "../../../../environments/Environment";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import axios from "axios";
import { useParams } from "react-router-dom";

const RemitanceInvoice = () => {
  const theme = useTheme();
  const { id } = useParams();

  let featureItems = [];
  if (id === "invoice") {
    featureItems = [
      // {
      //   title: "Project Scope Extraction",
      //   description: "Extracts the Project Scope from Document",
      //   icon: <Description fontSize="large" />,
      //   action: () => {
      //     axios.get(Environment.extractorService + "run").catch((error) => {
      //       console.error("Error during Project Scope Extraction:", error);
      //     });
      //   },
      // },
      {
        title: "Remittance Extraction",
        description: "Consolidate the Invoice Remittances",
        icon: <Receipt fontSize="large" />,
        action: () => {
          Toaster(
            "success",
            "Remittance records will be extracted and available for download under reports, please check after an hour."
          );
          axios
            .get(Environment.emsUrl + "/Emailextraction/callAsyncInvoice")
            .catch((error) => {
              console.error("Error during Project Scope Extraction:", error);
            });
        },
      },
      // {
      //   title: "Payment Extraction",
      //   description: "Consolidate the Vendor Payments",
      //   icon: <Payment fontSize="large" />,
      //   action: () => {
      //     axios
      //       .get(Environment.extractorService + "invoiceExtractAP")
      //       .catch((error) => {
      //         console.error("Error during Project Scope Extraction:", error);
      //       });
      //   },
      // },
    ];
  } else {
    featureItems = [
      {
        title: "File Archive",
        description: "",
        icon: <Receipt fontSize="large" />,
        action: () => {
          Toaster(
            "success",
            "Remittance Records will be Extracted in to the Destination Folder, please check after an hour."
          );
          axios
            .get(Environment.emsUrl + "/Emailextraction/invoiceFileArchive")
            .then((a) => {
              Toaster("success", "Remitance invoice file is archived.");
            })
            .catch((error) => {
              console.error("Error archiving file:", error);
              Toaster("error", "Error archiving file.");
            });
        },
      },
      {
        title: "File Download",
        description: "",
        icon: <Receipt fontSize="large" />,
        action: () => {
          handleDownload();
        },
      },
    ];
  }

  const handleDownload = () => {
    axios
      .get(Environment.emsUrl + "/Emailextraction/downloadInvoiceExcel", {
        responseType: "blob",
      })
      .then((res) => res.data)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "remitance.xlsx"); // Specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM after download
      })
      .catch((error) => {
        console.error("Failed to download the File:", error);
        Toaster("error", "Failed to download the File");
      });
  };

  return (
    <Box
      sx={{
        ...panelStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 4,
          textAlign: "center",
          textTransform: "none",
        }}
      >
        {id === "reports" ? "Reports" : "Document Processing Features"}
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: 1200 }}
      >
        {featureItems.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Button
              fullWidth
              onClick={item.action}
              sx={{
                p: 3,
                height: 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 3,
                transition: "all 0.3s ease",
                backgroundColor: theme.palette.background.default,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 2,
                  backgroundColor: theme.palette.action.hover,
                },
                textTransform: "none",
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1.5,
                  textAlign: "center",
                  fontSize: "1.1rem",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  maxWidth: 200,
                  fontSize: "0.875rem",
                }}
              >
                {item.description}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RemitanceInvoice;
