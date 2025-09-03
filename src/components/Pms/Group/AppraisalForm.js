import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserManagentCheck } from "../../../common/UserManagement";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllDesignations } from "../../../service/api/DesinationService";
import { updateRoleTypes } from "../../../service/api/nemsService/Payroll";
import { GetAllRoleType } from "../../../service/api/itService/ItService";
import { GetAllRoleName } from "../../../service/api/login/loginService";
import {
  GetParams,
  UpdateApprisalDetails,
  updateAttributeDetails,
  UploadAppraisalLetter,
} from "../../../service/api/pmsService/GetParameter";
import { GetEmployeeCtcDetails } from "../../../service/api/nemsService/EmployeeService";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete Icon

const VisuallyHiddenInput = styled("input")({
  opacity: 0,
  position: "absolute",
  zIndex: -1,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  textAlign: "center",
  fontWeight: "bold",
  color: "#19A4E6",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const defaultErrors = {
  hikePercentage: "",
};

function AppraisalForm() {
  const [staticData, setStaticData] = useState({
    empBasicDetailId: "",
    performanceGroup: "",
    performanceSubGroup: "",
    appraisalStatus: "",
  });
  const [tableData, setTableData] = useState([]);
  const { employeeData } = useContext(EmployeeDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [formData, setFormData] = useState({
    role: [], // <-- Default it to an empty array
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState(defaultErrors);
  const [attributeData, setAttributeData] = useState([]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      Toaster("success", "File uploaded successfully");
    }
  };

  // Function to remove the uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null); // Remove the file
    Toaster("success", "File removed successfully");
  };

  const handleChange = (e, rowIndex, field) => {
    const { value } = e.target;
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [field]: value };
      return newData;
    });
  };
  const handleAttributeChange = (value, rowIndex, field) => {
    setAttributeData((prevData) => {
      const updated = [...prevData];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });
  };
  const handleRatingChange = (value, rowIndex, field) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [field]: value };
      return newData;
    });
  };

  const handleSave = async () => {
    // Check if file is missing and appraisal status is 114
    if (staticData.appraisalStatus === "114" && !uploadedFile) {
      saveFormData();
      return;
    }

    try {
      // If a file is uploaded, call the UploadAppraisalLetter API
      if (uploadedFile) {
        const uploadResponse = await UploadAppraisalLetter(
          employeeData?.emailId,
          staticData.employeeBasicDetailId,
          staticData.status,
          uploadedFile
        );

        if (!uploadResponse) {
          Toaster("error", "Failed to upload the appraisal letter.");
          return;
        }

        Toaster("success", "Appraisal letter uploaded successfully.");
      }

      // Proceed to update appraisal details
      await saveFormData();
    } catch (error) {
      console.error("Error during the save process:", error);
      Toaster("error", "An error occurred during the save process.");
    }
  };

  // Inside saveFormData function — Add validation for attributeData
  const saveFormData = () => {
    console.log("Table Data:", tableData);

    for (const row of tableData) {
      if (staticData.status == 112) {
        if (!row.rating) {
          Toaster("error", "Please select a rating");
          return;
        }
        if (!row.description) {
          Toaster("error", "Please enter comments");
          return;
        }
      }
      if (staticData.status == 113) {
        if (!row.managerRating) {
          Toaster("error", "Please select a manager rating");
          return;
        }
        if (!row.comments) {
          Toaster("error", "Please enter manager comments");
          return;
        }
      }
      if (staticData.status == 114) {
        if (!row.finalRating) {
          Toaster("error", "Please select a final rating");
          return;
        }
        if (!row.finalComments) {
          Toaster("error", "Please enter final comments");
          return;
        }
      }
    }

    for (const row of attributeData) {
      if (staticData.status === "112" && !row.employeeRating) {
        Toaster("error", "Please rate all attribute(s)");
        return;
      }
      if (staticData.status === "113" && !row.managerRating) {
        Toaster("error", "Please provide manager rating for all attributes");
        return;
      }
      if (staticData.status === "114" && !row.finalRating) {
        Toaster("error", "Please provide final rating for all attributes");
        return;
      }
    }

    if (staticData.status === "114") {
      const employeeRole = roleTypes.find(
        (role) => role.roleType === "Employee"
      );
      const hasEmployeeRole =
        employeeRole && Array.isArray(formData.role)
          ? formData.role.includes(employeeRole.roleTypeCode)
          : false;

      if (!hasEmployeeRole) {
        Toaster(
          "error",
          "The 'Employee' role is required. Please select it before submitting."
        );
        return;
      }
    }

    const req = {
      performrnceReviewId: staticData.performarnceReviewId,
      status:
        staticData.status == 114
          ? "102"
          : String(Number(staticData.status) + 1),
      modifiedBy: employeeData?.emailId,
      newDesignation: formData.designation || null,
      percentageOfHike: formData.hikePercentage || null,
      newRole: formData.role || null,
      performanceDetails: tableData.map((data) => ({
        performanceDetailsId: data.performanceDetailsId,
        comments: data.description,
        finalRating: data.finalRating,
        finalComments: data.finalComments,
        status:
          staticData.status == 114
            ? "102"
            : String(Number(staticData.status) + 1),
        selfRating: data.rating,
        managerRating: data.managerRating,
        managerComments: data.comments,
        modifiedBy: employeeData?.emailId,
        achievedPercentege: data.achievedPercentage,
      })),
    };

    UpdateApprisalDetails(req)
      .then((res) => {
        if (res) {
          Toaster("success", "Updated Appraisal Details");

          const attrReq = attributeData.map((attr) => ({
            empGoalAttributeId: attr.empGoalAttributeId,
            employeeRating: attr.employeeRating,
            managerRating: attr.managerRating,
            finalRating: attr.finalRating,
            empBasicDetailId: staticData.empBasicDetailId,
            approveComments: attr.comments,
            employeeComments: attr.employeeComments,
            finalComments: attr.finalComments,
            createdBy: employeeData?.emailId,
            attribute: attr.attribute,
          }));

          updateAttributeDetails(attrReq)
            .then(() => {
              console.log("Attributes saved");
            })
            .catch((err) => {
              console.error("Attribute save error:", err);
              Toaster("error", "Failed to save attributes");
            });

          if (req.newRole) {
            const updateRolePayload = {
              employeeCode: staticData.empBasicDetailId,
              roleTypes: formData.role || [],
            };

            updateRoleTypes(updateRolePayload)
              .then((roleRes) => {
                if (roleRes) {
                  navigate(
                    !data ? "/home" : "/home/nems/appraisal/initiateAppraisal"
                  );
                }
              })
              .catch((roleErr) => {
                console.log(roleErr);
                Toaster("error", roleErr?.response?.data?.message);
              });
          } else {
            navigate(!data ? "/home" : "/home/nems/appraisal/initiateAppraisal");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        Toaster("error", err?.response?.data?.message);
      });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isFieldEditable = (field, appraisalStatus) => {
    if (
      field === "rating" ||
      field === "description" ||
      field === "achievedPercentage"
    ) {
      return (
        appraisalStatus === "112" && !data && UserManagentCheck("em_appraisal")
      );
    } else if (field === "managerRating" || field === "comments") {
      return (
        appraisalStatus === "113" &&
        data &&
        UserManagentCheck("manager_appraisal")
      );
    } else if (field === "finalRating" || field === "finalComments") {
      return (
        appraisalStatus === "114" && data && UserManagentCheck("hr_appraisal")
      );
    }
    return false;
  };

  const configureForm = useCallback(
    (input) => {
      return [
        {
          type: "multiSelect",
          name: "role",
          label: (
            <span>
              Role Name <span style={{ color: "red" }}>*</span>
            </span>
          ),
          value: input?.role,
          options: roleTypes.map((r) => ({
            key: r.roleTypeCode,
            value: r.roleType,
          })),
        },
      ];
    },
    [roleTypes]
  );

  const formChange = (event) => {
    const { name, value } = event.target;
    if (name === "hikePercentage") {
      const percentageRegex = /^[0-9]*(\.[0-9]{0,2})?$/;
      if (!value) {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
          revisedCtc: "",
        }));
        return;
      }
      if (percentageRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          revisedCtc:
            prev.currentCtc + (prev.currentCtc * parseFloat(value)) / 100,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paramsData = await GetParams(
          data
            ? data.employeeBasicDetailId
            : employeeData?.employeeBasicDetailId,
          data ? "other" : "employee"
        );

        if (paramsData) {
          const firstEntry = paramsData;

          setStaticData({
            ...firstEntry,
            empBasicDetailId: firstEntry?.employeeCode,
            performanceGroup: firstEntry?.group,
            performanceSubGroup: firstEntry?.subGroup,
            appraisalStatus: firstEntry.status,
          });

          // Set Goals Data
          const goals = Array.isArray(firstEntry.performanceDetails)
            ? firstEntry.performanceDetails.map((param) => ({
                performanceDetailsId: param.performanceDetailsId,
                goal: param.performanceParameter,
                rating: param.selfRating || "",
                description: param.comments || "",
                managerRating: param.managerRating || "",
                comments: param.managerComments || "",
                finalRating: param.finalRating || "",
                finalComments: param.finalComments || "",
                goalDecription: param.goalDecription || "",
                goalPercentage: param.goalPercentage || 0,
                achievedPercentage: param.achievedPercentage || "",
              }))
            : [];

          setTableData(goals);

          // Set Attribute Data
          const attributes = Array.isArray(firstEntry.goalAttributeEntities)
            ? firstEntry.goalAttributeEntities.map((attr) => ({
                empGoalAttributeId: attr.empGoalAttributeId,
                attribute: attr.attribute,
                employeeRating: attr.employeeRating || null,
                employeeComments: attr.employeeComments || "",
                managerRating: attr.managerRating || null,
                comments: attr.approveComments || "",
                finalRating: attr.finalRating || null,
                finalComments: attr.finalComments || "",
              }))
            : [];

          setAttributeData(attributes);

          // Role & Designation Prefill
          setFormData((prev) => ({
            ...prev,
            designation: firstEntry?.designation || "",
          }));

          const employeeCode =
            paramsData?.employeeCode || employeeData?.employeeBasicDetailId;
          const rolesData = await GetAllRoleName(employeeCode);
          setRoles(rolesData);

          setFormData((prev) => ({
            ...prev,
            role: Array.isArray(rolesData)
              ? rolesData.map((r) => r.roleTypeCode)
              : [],
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [employeeData, data]);

  useEffect(() => {
    GetAllDesignations()
      .then((data) => {
        setDesignations(data);
      })
      .catch();
    GetAllRoleType()
      .then((data) => {
        setRoleTypes(data);
      })
      .catch();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Appraisal Form
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography variant="body1" color="textPrimary">
              <strong>Employee ID:</strong> {staticData.empBasicDetailId}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body1" color="textPrimary">
              <strong>Employee Name:</strong> {staticData.fullName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body1" color="textPrimary">
              <strong>Group:</strong> {staticData.performanceGroup}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body1" color="textPrimary">
              <strong>Sub-group:</strong> {staticData.performanceSubGroup}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body1" color="textPrimary">
              <strong>Status:</strong> {staticData.statusDescription}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Goal</StyledTableCell>
              <StyledTableCell>Goal Description</StyledTableCell>
              <StyledTableCell>Goal Weightage</StyledTableCell>
              {/* <StyledTableCell>Achieved Weightage</StyledTableCell> */}
              <StyledTableCell>Self Rating</StyledTableCell>
              <StyledTableCell>Self Description</StyledTableCell>
              <StyledTableCell>Manager Rating</StyledTableCell>
              <StyledTableCell>Comments</StyledTableCell>
              <StyledTableCell>Final Rating</StyledTableCell>
              <StyledTableCell>Final Comments</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{row.goal}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.goalDecription || ""}
                    disabled
                    multiline
                    InputProps={{
                      sx: {
                        fontSize: "0.75rem",
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.goalPercentage}
                    disabled
                    fullWidth
                    InputProps={{ sx: { fontSize: "0.75rem" } }}
                  />
                </TableCell>
                {/* <TableCell>
                  <TextField
                    fullWidth
                    type="number"
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "[0-9]*",
                      style: {
                        MozAppearance: "textfield",
                      },
                    }}
                    value={
                      row.achievedPercentage === "0" ||
                      row.achievedPercentage === 0
                        ? ""
                        : row.achievedPercentage
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const parsedValue = inputValue.replace(/[^0-9.]/g, "");
                      setTableData((prevData) => {
                        const newData = [...prevData];
                        newData[rowIndex] = {
                          ...newData[rowIndex],
                          achievedPercentage: parsedValue,
                        };
                        return newData;
                      });
                    }}
                    variant="outlined"
                    InputProps={{
                      sx: { fontSize: "0.75rem" },
                      disableUnderline: true,
                    }}
                    sx={{
                      "& input[type=number]::-webkit-outer-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                      "& input[type=number]::-webkit-inner-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    }}
                    disabled={
                      !isFieldEditable("rating", staticData.appraisalStatus)
                    }
                  />
                </TableCell> */}

                <TableCell>
                  <Rating
                    value={row.rating}
                    onChange={(_event, newValue) =>
                      handleRatingChange(newValue, rowIndex, "rating")
                    }
                    precision={0.5}
                    size="small"
                    readOnly={
                      !isFieldEditable("rating", staticData.appraisalStatus)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.description}
                    onChange={(e) => handleChange(e, rowIndex, "description")}
                    multiline={true}
                    variant="outlined"
                    InputProps={{
                      sx: {
                        fontSize: "0.75rem",
                      },
                    }}
                    disabled={
                      !isFieldEditable(
                        "description",
                        staticData.appraisalStatus
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Rating
                    value={row.managerRating}
                    onChange={(_event, newValue) =>
                      handleRatingChange(newValue, rowIndex, "managerRating")
                    }
                    precision={0.5}
                    size="small"
                    readOnly={
                      !isFieldEditable(
                        "managerRating",
                        staticData.appraisalStatus
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.comments}
                    onChange={(e) => handleChange(e, rowIndex, "comments")}
                    variant="outlined"
                    multiline={true}
                    disabled={
                      !isFieldEditable("comments", staticData.appraisalStatus)
                    }
                    InputProps={{ sx: { fontSize: "0.75rem" } }}
                  />
                </TableCell>
                <TableCell>
                  <Rating
                    value={row.finalRating}
                    onChange={(_event, newValue) =>
                      handleRatingChange(newValue, rowIndex, "finalRating")
                    }
                    precision={0.5}
                    size="small"
                    readOnly={
                      !isFieldEditable(
                        "finalRating",
                        staticData.appraisalStatus
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.finalComments}
                    onChange={(e) => handleChange(e, rowIndex, "finalComments")}
                    variant="outlined"
                    multiline
                    disabled={
                      !isFieldEditable(
                        "finalComments",
                        staticData.appraisalStatus
                      )
                    }
                    InputProps={{ sx: { fontSize: "0.75rem" } }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }} color="primary">
        Attributes
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Attribute Name</StyledTableCell>
              <StyledTableCell>Self Rating</StyledTableCell>
              <StyledTableCell>Self Description</StyledTableCell>
              <StyledTableCell>Manager Rating</StyledTableCell>
              <StyledTableCell>Comments</StyledTableCell>
              <StyledTableCell>Final Rating</StyledTableCell>
              <StyledTableCell>Final Comments</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attributeData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{row.attribute}</TableCell>
                <TableCell>
                  <Rating
                    value={row.employeeRating}
                    onChange={(_e, newValue) =>
                      handleAttributeChange(
                        newValue,
                        rowIndex,
                        "employeeRating"
                      )
                    }
                    precision={0.5}
                    size="small"
                    readOnly={
                      !isFieldEditable("rating", staticData.appraisalStatus)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.employeeComments}
                    onChange={(e) =>
                      handleAttributeChange(
                        e.target.value,
                        rowIndex,
                        "employeeComments"
                      )
                    }
                    multiline
                    fullWidth
                    variant="outlined"
                    disabled={
                      !isFieldEditable(
                        "description",
                        staticData.appraisalStatus
                      )
                    }
                    InputProps={{ sx: { fontSize: "0.75rem" } }}
                  />
                </TableCell>
                <TableCell>
                  <Rating
                    value={row.managerRating}
                    onChange={(_e, newValue) =>
                      handleAttributeChange(newValue, rowIndex, "managerRating")
                    }
                    precision={0.5}
                    size="small"
                    readOnly={
                      !isFieldEditable(
                        "managerRating",
                        staticData.appraisalStatus
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.comments}
                    onChange={(e) =>
                      handleAttributeChange(
                        e.target.value,
                        rowIndex,
                        "comments"
                      )
                    }
                    multiline
                    fullWidth
                    variant="outlined"
                    disabled={
                      !isFieldEditable("comments", staticData.appraisalStatus)
                    }
                    InputProps={{ sx: { fontSize: "0.75rem" } }}
                  />
                </TableCell>
                <TableCell>
                  <Rating
                    value={row.finalRating}
                    onChange={(_e, newValue) =>
                      handleAttributeChange(newValue, rowIndex, "finalRating")
                    }
                    precision={0.5}
                    size="small"
                    readOnly={
                      !isFieldEditable(
                        "finalRating",
                        staticData.appraisalStatus
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.finalComments}
                    onChange={(e) =>
                      handleAttributeChange(
                        e.target.value,
                        rowIndex,
                        "finalComments"
                      )
                    }
                    multiline
                    fullWidth
                    variant="outlined"
                    disabled={
                      !isFieldEditable(
                        "finalComments",
                        staticData.appraisalStatus
                      )
                    }
                    InputProps={{ sx: { fontSize: "0.75rem" } }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {false && staticData.appraisalStatus === "114" && (
        <Box sx={{ marginTop: 2 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Compensation Revision Letter
            <input
              type="file"
              onChange={handleFileUpload}
              accept="application/pdf"
              style={{ display: "none" }}
            />
          </Button>

          {/* Display uploaded file name and delete option */}
          {uploadedFile && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                {uploadedFile.name}
              </Typography>
              <IconButton
                color="error"
                onClick={handleRemoveFile}
                aria-label="delete uploaded file"
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ marginTop: 2 }}>
        <ConfigureForm
          data={
            isFieldEditable("finalRating", staticData.appraisalStatus) ||
            staticData.appraisalStatus === "102"
              ? configureForm(formData)
              : null
          }
          buttonTitle="Submit"
          readOnly={staticData.appraisalStatus !== "114"}
          handleChange={formChange}
          submitClicked={handleSave}
          buttonsHide={{
            reset: false,
            save:
              isFieldEditable("rating", staticData.appraisalStatus) ||
              isFieldEditable("managerRating", staticData.appraisalStatus) ||
              isFieldEditable("finalRating", staticData.appraisalStatus),
          }}
        />
      </Box>
    </Box>
  );
}

export default AppraisalForm;
