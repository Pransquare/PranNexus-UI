import { CheckSharp, ClearSharp } from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  DownloadResponseFile,
  MigrateToPayrollMaster,
  UploadPayrollFile,
  ValidatePayroll,
  DownloadSampleTemplate,
} from "../../../service/api/nemsService/Payroll";
import dayjs from "dayjs";

const PayrollUpload = () => {
  const { employeeData } = useContext(EmployeeDataContext);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState();
  const [templateUrl, setTemplateUrl] = useState(""); // State to store template URL

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType === "application/vnd.ms-excel" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
      } else {
        Toaster("error", "Please select an Excel file");
        setFile(null);
      }
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
  };

  const handleSubmit = () => {
    if (!file) {
      Toaster("error", "Please select a file to upload");
      return;
    }
    if (!formData?.monthAndYear) {
      Toaster("error", "Please select a month and year");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append(
      "payrollUploadModel",
      JSON.stringify({
        createdBy: employeeData?.emailId,
        year: formData?.monthAndYear?.year(),
        month: formData?.monthAndYear?.month(),
      })
    );

    UploadPayrollFile(form)
      .then(async (res) => {
        await ValidatePayroll({
          createdBy: employeeData?.emailId,
          fileId: res?.payrollUploadSummaryEntity?.fileId,
        }).catch((err) => {
          console.log(err);

          Toaster("error", "Failed to validate payroll file");
        });
        let filePath;
        await MigrateToPayrollMaster({
          createdBy: employeeData?.emailId,
          fileId: res?.payrollUploadSummaryEntity?.fileId,
        })
          .then((res) => {
            setFormData(null);
            setFile(null);
            filePath = res?.filePath;
          })
          .catch(() => {
            Toaster("error", "Failed to migrate payroll file");
          });
        await DownloadResponseFile(filePath)
          .then((res) => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "response.xlsx"); // Set the file name here
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up the DOM after download
          })
          .catch(() => {
            Toaster("error", "Failed to download Excel file");
          });

        Toaster("success", "Please check the response file");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        Toaster("error", err.response.data.message);
      });
  };

  const handleDownloadTemplate = () => {
    DownloadSampleTemplate()
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sample_template.xlsx"); // Specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the DOM after download
      })
      .catch((error) => {
        console.error("Failed to download the template:", error);
        Toaster("error", "Failed to download the template");
      });
  };

  const configFormData = (input) => {
    return [
      {
        label: "Month and Year",
        name: "monthAndYear",
        type: "monthAndYearSelect",
        value: input?.monthAndYear,
        maxDate: dayjs(),
        required: true,
      },
    ];
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          border: "2px dashed #ccc",
          borderRadius: 2,
          maxWidth: 400,
          mx: "auto",
          marginY: 4,
          height: 300,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload your file
        </Typography>
        <ConfigureForm
          data={configFormData(formData)}
          handleChange={handleChange}
          actionsHide={false}
        />
        <label htmlFor="file-upload">
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<UploadFileIcon />}
          >
            Choose File
          </Button>
        </label>
        {file && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ flexGrow: 1, mr: 1, color: "black", cursor: "pointer" }}
            >
              {file.name}
            </Typography>
            <Tooltip title="Delete File">
              <IconButton
                color="warning"
                size="small"
                onClick={handleDeleteFile}
              >
                <ClearSharp fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Accept File">
              <IconButton color="success" size="small" onClick={handleSubmit}>
                <CheckSharp fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <br />
        <br />
        <a
          href={templateUrl || "#"}
          download="sample_template.xlsx"
          onClick={handleDownloadTemplate}
          style={{
            marginTop: "16px",
            textDecoration: "underline",
            color: "#1976d2",
            cursor: "pointer",
          }}
        >
          Download Sample Template
        </a>
      </Box>
      {/* <ConfigTable
        data={confiData(data)}
        headers={["file ID", "File Name", "Upload Date", "Status", "Action"]}
      /> */}
    </>
  );
};

export default PayrollUpload;
