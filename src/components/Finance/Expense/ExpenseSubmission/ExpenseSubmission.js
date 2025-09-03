import {
  CancelOutlined,
  CheckCircleOutline,
  CloudUploadOutlined,
  DeleteOutline,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  DialogContentText,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "../../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  GetAllExpenseListFromMaster,
  GetExpenseById,
  SaveExpense,
  UpdateBillStatus,
  UpdateExpenseStatus,
  UploadExpense,
} from "../../../../service/api/ExpenseService";
import { DownloadFile } from "../../../../service/api/nemsService/Payroll";
import { GetManagerName } from "../../../../service/api/nemsService/EmployeeLeaveService";
import { UserManagentCheck } from "../../../../common/UserManagement";
import ContentDialog from "../../../../common/customComponents/Dailogs/ContentDailog";
const defaultFormData = {
  fromDate: "",
  toDate: "",
  expenseName: "",
  expenseAmtType: "",
  expenses: [],
};

export const currencySymbols = {
  inr: "₹", // Indian Rupee
  usd: "$", // US Dollar
};

const ExpenseSubmission = () => {
  const { id } = useParams();
  const { employeeData } = useContext(EmployeeDataContext);
  const navigate = useNavigate();
  const rolenames = {
    expense_manager_approval: UserManagentCheck("expense_manager_approval"),
    expense_accounts_approval: UserManagentCheck("expense_accounts_approval"),
    expense_leaseship_approval: UserManagentCheck("expense_leaseship_approval"),
    expense_finance_approval: UserManagentCheck("expense_finance_approval"),
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [remarks, setRemarks] = useState("");
  const [selectedData, setSelectedData] = useState();
  const [open, setOpen] = useState(false);
  const [rejectionType, setRejectionType] = useState();
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [status, setstatus] = useState("113");
  const [approvalData, setApprovalData] = useState();
  const [managerName, setManagerName] = useState("");
  const [disableData, setDisableData] = useState({
    mainForm: false,
    expesneTable: false,
    addRowButton: false,
    submitButton: false,
    tableActions: false,
  });

  const handleExpenseChange = useCallback((rowIndex, field, value) => {
    setFormData((prev) => {
      const updatedExpenses = [...prev.expenses];
      if (field === "billAvailability" && !value) {
        // Clear uploaded file if billAvailability is unchecked
        updatedExpenses[rowIndex].uploadedFile = null;
      } else if (field === "expenseAmount") {
        updatedExpenses[rowIndex][field] =
          value === "" ? "" : parseFloat(value);
      }
      updatedExpenses[rowIndex][field] = value;
      updatedExpenses[rowIndex]["status"] = "113";
      updatedExpenses[rowIndex]["statusDescription"] = "";
      return { ...prev, expenses: updatedExpenses };
    });
  }, []);

  const handleAddExpenseRow = useCallback(() => {
    const { fromDate, toDate, expenseName, expenseAmtType } = formData;

    // Regular expression for validating allowed characters
    const validExpenseNameRegex = /^[a-zA-Z0-9 _#-]*$/;

    if (!fromDate || !toDate || !expenseName || !expenseAmtType) {
      Toaster("error", "Please fill all the mandatory fields.");
      return;
    }

    // Validate `expenseName` for allowed special characters
    if (!validExpenseNameRegex.test(expenseName)) {
      Toaster(
        "error",
        "Expense name should only contain letters, numbers, spaces, and these special characters: _ - #"
      );
      return;
    }

    setFormData((prev) => {
      const newRow = {
        expenseDate: "",
        expenseCode: "",
        expenseDescription: "",
        expenseAmount: 0,
        billAvailability: false,
        uploadedFile: null,
      };
      return { ...prev, expenses: [...prev.expenses, newRow] };
    });
  }, [formData]);

  const handleDeleteExpenseRow = useCallback((rowIndex) => {
    setFormData((prev) => {
      const updatedExpenses = [...prev.expenses];
      updatedExpenses.splice(rowIndex, 1);
      return { ...prev, expenses: updatedExpenses };
    });
  }, []);

  const handleFileUpload = async (rowIndex, file) => {
    if (file.size > 5 * 1024 * 1024) {
      Toaster("error", "File size should not exceed 5MB.");
      return;
    }
    if (!["image/png", "image/jpeg", "application/pdf"].includes(file.type)) {
      Toaster("error", "Only PNG, JPEG, and PDF files are allowed.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    const filePath = await UploadExpense(formData, employeeData?.employeeCode);
    if (filePath.length) {
      setFormData((prev) => {
        const updatedExpenses = [...prev.expenses];
        updatedExpenses[rowIndex].filePath = filePath[0];
        updatedExpenses[rowIndex]["status"] = "113";
        updatedExpenses[rowIndex]["statusDescription"] = "";
        return { ...prev, expenses: updatedExpenses };
      });
    }
  };

  const totalExpense = formData?.expenses
    ?.reduce((sum, row) => sum + (parseFloat(row.expenseAmount) || 0), 0)
    .toFixed(2);

  const onloadData = useCallback(async () => {
    console.log(id);
    try {
      const response = await GetAllExpenseListFromMaster();
      setExpenseTypes(response);
      if (id) {
        const expense = await GetExpenseById(id);
        if (expense) {
          setFormData((prev) => ({
            ...prev,
            ...expense,
            fromDate: dayjs(expense.from, "YYYY-MM-DD"),
            toDate: dayjs(expense.to, "YYYY-MM-DD"),
            expenses: expense.expenseDetails,
          }));
          if (expense?.employeeId === employeeData?.employeeBasicDetailId) {
            setDisableData((prev) => ({
              ...prev,
              mainForm: true,
              expesneTable: true,
              tableActions: true,
            }));
          }
          switch (expense?.status) {
            case "113":
              setstatus("121");
              setDisableData((prev) => ({
                ...prev,
                mainForm: true,
                expesneTable: true,
              }));
              break;
            case "121":
              setstatus("122");
              setDisableData((prev) => ({
                ...prev,
                mainForm: true,
                expesneTable: true,
              }));
              break;
            case "122":
              setstatus("123");
              setDisableData((prev) => ({
                ...prev,
                mainForm: true,
                expesneTable: true,
              }));
              break;
            case "123":
              setstatus("102");
              setDisableData((prev) => ({
                ...prev,
                mainForm: true,
                expesneTable: true,
              }));
              break;
            case "124":
              setstatus("113");
              setDisableData((prev) => ({
                ...prev,
                mainForm: true,
                expesneTable: false,
                tableActions: false,
              }));
              break;
            default:
              setDisableData((prev) => ({
                ...prev,
                mainForm: true,
                expesneTable: true,
                addRowButton: true,
                submitButton: true,
                tableActions: true,
              }));
              setstatus("");
              break;
          }
        }
      } else {
        GetManagerName(employeeData?.employeeBasicDetailId, "jobManager", null)
          .then((managerData) => {
            setApprovalData(managerData);
          })
          .catch((err) => {
            Toaster("error", "Please contact HR to configure the job manager");
          });
        setFormData((pre) => ({ ...pre, ...defaultFormData }));
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
    }
  }, [employeeData, id]);

  const fetchManagerName = useCallback(async () => {
    try {
      if (!employeeData?.employeeBasicDetailId) {
        Toaster("error", "Employee ID not found");
        return;
      }
      const bodyPayload = {
        additionalInfo: "example data",
      };
      const managerData = await GetManagerName(
        employeeData?.employeeBasicDetailId,
        "jobManager",
        bodyPayload
      );

      if (managerData && managerData.approverName) {
        setManagerName(managerData.approverName);
      } else {
        setManagerName("N/A"); // Default if no manager name found
      }
    } catch (error) {
      console.error("Failed to fetch manager name:", error);
      setManagerName("N/A");
    }
  }, [employeeData?.employeeBasicDetailId]);

  useEffect(() => {
    fetchManagerName();
  }, [fetchManagerName]);
  const viewFile = (filePath) => {
    DownloadFile(filePath)
      .then((response) => {
        const contentType = response.headers["content-type"]; // Get MIME type from the headers
        const contentDisposition = response.headers["content-disposition"]; // Get file name from headers
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        if (contentType.includes("application/pdf")) {
          // Open PDFs in a new tab
          window.open(url, "_blank");
        } else if (contentType.startsWith("image/")) {
          // Open images in a new tab
          window.open(url, "_blank");
        } else {
          // Default to download
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            extractFileName(contentDisposition) || getFallbackFileName(filePath)
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Clean up the DOM after download
        }

        // Release the URL
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading/viewing file:", error);
        Toaster("error", "Failed to download or view file");
      });
  };

  // Helper to extract the file name from the Content-Disposition header
  const extractFileName = (contentDisposition) => {
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      return fileNameMatch ? fileNameMatch[1] : null;
    }
    return null;
  };

  // Fallback helper to get the file name from the file path
  const getFallbackFileName = (filePath) => {
    return filePath.split("/").pop() || "downloaded_file";
  };
  const submit = async () => {
    if (
      !formData.fromDate ||
      !formData.toDate ||
      !formData.expenseName ||
      !formData.expenseAmtType
    ) {
      Toaster("error", "Please fill all the fields");
      return;
    }
    if (
      formData.expenses?.find(
        (a) =>
          !a.expenseDate ||
          !a.expenseCode ||
          !a.expenseAmount ||
          (a.billAvailability && !a.filePath)
      )
    ) {
      Toaster("error", "Please fill the mandatory fields.");
      return;
    }
    console.log(totalExpense);
    const req = {
      ...formData,
      from: dayjs(formData.fromDate).format("YYYY-MM-DD"),
      to: dayjs(formData.toDate).format("YYYY-MM-DD"),
      status: status,
      employeeId: employeeData?.employeeBasicDetailId,
      expenseAmtType: formData.expenseAmtType,
      entryDate: dayjs().toISOString(),
      managerId: formData.managerId || approvalData?.approverId,
      expenseName: formData.expenseName.trim(),
      expenseAmount: parseFloat(totalExpense),
      expenseDetails: formData?.expenses?.map((a) => ({
        ...a,
        expenseDate: dayjs(a.expenseDate).format("YYYY-MM-DD"),
        status: a.status || status,
        createdBy: a.createdBy || employeeData?.employeeCode,
        createdDate: a.createdDate || dayjs().toISOString(),
        modifiedBy: employeeData?.employeeCode,
        modifiedDate: dayjs().toISOString(),
      })),
    };
    let res = await SaveExpense(req);
    if (!res) {
      Toaster("warning", "Somethig went wrong please try again.");
      return;
    } else {
      Toaster("success", "Expense submitted successfully");
      navigate("/home/finance/expense/records");
    }
  };

  const handleApprove = (data) => {
    UpdateBillStatus({
      id: data.id,
      status: "102",
      user: employeeData?.emailId,
    })
      .then((a) => {
        if (a) {
          Toaster("success", "Bill approved successfully");
          onloadData();
        }
      })
      .catch();
  };
  const handleReject = (data) => {
    UpdateBillStatus({
      id: data.id,
      status: "103",
      user: employeeData?.emailId,
      comments: remarks,
    })
      .then((a) => {
        if (a) {
          Toaster("success", "Bill rejected successfully");
          onloadData();
        }
      })
      .catch();
  };

  const dailogContent = () => {
    return (
      <>
        <DialogContentText>Please enter remarks :</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="remarks"
          label="Remarks"
          type="text"
          fullWidth
          size="small"
          value={remarks}
          onChange={(event) => {
            const { value } = event.target;
            setRemarks(value);
          }}
        />
      </>
    );
  };

  const handleExpenseUpdate = (iStatus) => {
    if (!iStatus) {
      if (formData?.expenses.find((a) => a.status !== "102")) {
        Toaster(
          "warning",
          "Please approve all expenses before approving the bill"
        );
        return;
      }
    }
    UpdateExpenseStatus({
      id: formData.id,
      status: iStatus || status,
      user: employeeData?.emailId,
      comments: remarks,
    })
      .then((a) => {
        if (a) {
          Toaster("success", "Expense updated successfully");
          navigate("/home/finance/expense/records");
        }
      })
      .catch();
  };
  useEffect(() => {
    onloadData();
  }, [onloadData, id]);

  return (
    <>
      <Box sx={{ ...panelStyle }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            pr: 2, // padding right
            mt: 1, // margin top if needed
          }}
        >
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            Manager Name:
          </Typography>
          <Typography
            variant="subtitle1"
            color={managerName !== "N/A" ? "primary" : "error"}
          >
            {managerName}
          </Typography>
        </Box>
        <ConfigureForm
          data={[
            {
              label: "From Date",
              name: "fromDate",
              type: "datePicker",
              value: formData.fromDate,
              minDate: dayjs(employeeData?.dateOfJoining),
              maxDate: dayjs(),
              required: true,
            },
            {
              label: "To Date",
              name: "toDate",
              type: "datePicker",
              value: formData.toDate,
              minDate: dayjs(formData.fromDate),
              maxDate: dayjs(),
              required: true,
            },
            {
              label: "Expense Name",
              name: "expenseName",
              type: "text",
              value: formData.expenseName.trimStart(),
              required: true,
            },
            {
              label: "Expense Amount Type",
              name: "expenseAmtType",
              type: "dropDownList",
              options: [
                { value: "INR", key: "inr" },
                { value: "USD", key: "usd" },
              ],
              value: formData.expenseAmtType,
              required: true,
            },
            {
              label: "Approver comments",
              name: "comments",
              type: "textarea",
              value: formData.comments,
              disable: true,
            },
          ]}
          handleChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          readOnly={disableData.mainForm && !!formData?.expenses?.length}
          actionsHide={false}
        />
        <Divider sx={{ my: 1 }} />
        <Box sx={{ mb: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Expense Date</TableCell>
                  <TableCell>Expense Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount *</TableCell>
                  <TableCell>Bill Available</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Approver comments</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData?.expenses?.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          readOnly={
                            disableData.expesneTable || row.status === "102"
                          }
                          value={
                            row.expenseDate ? dayjs(row.expenseDate) : null
                          }
                          onChange={(date) =>
                            handleExpenseChange(rowIndex, "expenseDate", date)
                          }
                          format="DD-MM-YYYY"
                          slotProps={{
                            textField: {
                              size: "small",
                              sx: { width: "150px" },
                            },
                          }}
                          minDate={dayjs(formData.fromDate)}
                          maxDate={dayjs(formData.toDate)}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row.expenseCode || ""}
                          onChange={(e) =>
                            handleExpenseChange(
                              rowIndex,
                              "expenseCode",
                              e.target.value
                            )
                          }
                          size="small"
                          readOnly={
                            disableData.expesneTable || row.status === "102"
                          }
                        >
                          {expenseTypes?.map((expense) => (
                            <MenuItem
                              key={expense.expenseCode}
                              value={expense.expenseCode}
                            >
                              {expense.expenseDesc}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.expenseDescription}
                        onChange={(e) =>
                          handleExpenseChange(
                            rowIndex,
                            "expenseDescription",
                            e.target.value.trimStart()
                          )
                        }
                        size="small"
                        sx={{ width: "200px" }}
                        InputProps={{
                          readOnly:
                            disableData.expesneTable || row.status === "102",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={row.expenseAmount === 0 ? "" : row.expenseAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d*$/.test(value)) {
                            handleExpenseChange(
                              rowIndex,
                              "expenseAmount",
                              value
                            );
                          }
                        }}
                        size="small"
                        type="text"
                        sx={{ width: "150px" }}
                        inputProps={{
                          inputMode: "decimal",
                        }}
                        InputProps={{
                          readOnly:
                            disableData.expesneTable || row.status === "102",
                        }}
                        required={true}
                      />
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        disabled={
                          disableData.expesneTable || row.status === "102"
                        }
                        checked={row.billAvailability}
                        onChange={(e) =>
                          handleExpenseChange(
                            rowIndex,
                            "billAvailability",
                            e.target.checked
                          )
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {status === "113" && row.status !== "102" && (
                        <IconButton
                          component="label"
                          size="small"
                          disabled={!row.billAvailability}
                          aria-label="Upload File"
                        >
                          <CloudUploadOutlined />
                          <input
                            type="file"
                            hidden
                            onChange={(e) =>
                              handleFileUpload(rowIndex, e.target.files[0])
                            }
                          />
                        </IconButton>
                      )}
                      {row.filePath && (
                        <IconButton
                          size="small"
                          aria-label="View File"
                          onClick={() => viewFile(row.filePath)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>{row.statusDescription}</TableCell>
                    <TableCell>{row.comments}</TableCell>
                    <TableCell>
                      {status === "113" && (
                        <IconButton
                          size="small"
                          color="error"
                          aria-label="Delete Row"
                          onClick={() => handleDeleteExpenseRow(rowIndex)}
                          disabled={row.status === "102"}
                        >
                          <DeleteOutline />
                        </IconButton>
                      )}
                      {status === "121" &&
                        row.status === "113" &&
                        rolenames.expense_manager_approval &&
                        !disableData?.tableActions && (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexDirection: "row-reverse",
                            }}
                          >
                            <IconButton
                              size="small"
                              color="success"
                              aria-label="Approve"
                              onClick={() => handleApprove(row)}
                            >
                              <CheckCircleOutline />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="Reject"
                              onClick={() => {
                                setSelectedData(row);
                                setRejectionType("bill");
                                setOpen(true);
                              }}
                            >
                              <CancelOutlined />
                            </IconButton>
                          </div>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <Box className="flex flex-row gap-2 items-center justify-start">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddExpenseRow}
                        disabled={status !== "113"}
                      >
                        Add Row
                      </Button>
                      <Typography variant="subtitle1">
                        Total: {currencySymbols[formData.expenseAmtType] || ""}{" "}
                        {totalExpense}
                      </Typography>
                    </Box>
                  </TableCell>
                  {status === "113" && !disableData?.tableActions && (
                    <TableCell colSpan={7} align="right">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={submit}
                        disabled={!formData.expenses?.length}
                      >
                        Submit
                      </Button>
                    </TableCell>
                  )}
                  {(status === "121" ||
                    status === "122" ||
                    status === "123" ||
                    status === "102") &&
                    !disableData?.tableActions && (
                      <TableCell colSpan={7} align="right">
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            onClick={() => {
                              setRejectionType("sendBackToEmp");
                              setOpen(true);
                              setRemarks("");
                            }}
                          >
                            Send back to Employee
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleExpenseUpdate()}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              setRejectionType("expesne");
                              setOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    )}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
        <ContentDialog
          openDialog={open}
          handleCloseDialog={(data) => {
            if (data) {
              if (!remarks) {
                Toaster("error", "Please enter Remarks");
                setOpen(false);
                return;
              }
              if (rejectionType === "bill") {
                handleReject(selectedData);
              } else if (rejectionType === "sendBackToEmp") {
                handleExpenseUpdate("124");
              } else {
                handleExpenseUpdate("103");
              }
              setOpen(false);
            } else {
              setOpen(false);
            }
          }}
          content={dailogContent()}
          actions={true}
          okText="Submit"
          cancelText="Cancel"
        />
      </Box>
    </>
  );
};

export default ExpenseSubmission;
