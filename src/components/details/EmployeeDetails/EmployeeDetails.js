import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  CreateOrUpdateEmployee,
  DownloadPayslip,
  OffboardMember,
} from "../../../service/api/emsService/EmployeeService";
import {
  DownloadResponseFile,
  GetEmployeePayslipDetailsById,
  SaveorUpdatePayslipDetails,
  updateRoleTypes,
} from "../../../service/api/emsService/Payroll";
import { GetAllRoleType } from "../../../service/api/itService/ItService";
import { GetAllRoleName } from "../../../service/api/login/loginService";
import {
  integerNotNullValidation,
  validatePhoneNumber,
} from "../../../common/commonValidation/CommonValidation";
import { DataArrayTwoTone } from "@mui/icons-material";
import ProfilePic from "../../ProfilePic/ProfilePic";
import {
  RemoveBillUrl,
  UploadExpense,
} from "../../../service/api/ExpenseService";

// Styled Tabs and Tab components for vertical orientation and smaller size
const VerticalTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const SmallTab = styled(Tab)(({ theme }) => ({
  minWidth: 120, // Adjust width as needed
  fontSize: "0.7rem", // Smaller font size
  textAlign: "left",
}));

function EmployeeDetails({
  inputData,
  apiData,
  readOnly = false,
  disableAllFields = false,
}) {
  const [tabValue, setTabValue] = useState(0); // State for active tab
  const [data, setData] = useState(inputData); // State for employee data
  const [originalRole, setOriginalRole] = useState(inputData.role || []); // Store initial role
  const [roleChanged, setRoleChanged] = useState(false);
  const { employeeData } = useContext(EmployeeDataContext); // Context for global employee data
  const [openOffboardModal, setOpenOffboardModal] = useState(false); // State for offboarding modal
  const [allRoleTypes, setAllRoleTypes] = useState([]); // State for all role types
  const [openDownloadPayslipModal, setOpenDownloadPayslipModal] =
    useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [payrollData, setPayrollData] = useState(null);
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const isFieldDisabled = disableAllFields || readOnly;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  // Fetch role names and types when component mounts
  useEffect(() => {
    if (data?.employeeCode && data?.employeeBasicDetailId) {
      GetAllRoleName(data.employeeCode)
        .then((res) => {
          setData((prev) => ({
            ...prev,
            role: res.map((role) => role.roleTypeCode),
          }));
          setOriginalRole(res.map((role) => role.roleTypeCode));
        })
        .catch((err) => console.error("Failed to fetch role names", err));

      GetAllRoleType()
        .then((res) => {
          setAllRoleTypes(res);
        })
        .catch((err) => console.error("Failed to fetch role types", err));

      GetEmployeePayslipDetailsById(data.employeeBasicDetailId).then((res) => {
        setPayrollData(res);
      });

      fetchProfilePic();
    }
  }, [data?.employeeBasicDetailId, data?.employeeCode]);

  const fetchProfilePic = async () => {
    if (data?.profilePicPath) {
      try {
        // Fetch image using the path from employee data
        const imagePath = data?.profilePicPath;
        const imageBlob = await DownloadResponseFile(imagePath); // Call the API to fetch image

        // Create a URL for the image blob and update state
        const imageURL = URL.createObjectURL(imageBlob);
        setProfilePic(imageURL);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    }
  };

  const handleImageSelect = async (file) => {
    // Create FormData to send the image to the backend
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    const type = "profilePic";

    try {
      const response = await UploadExpense(formData, data?.employeeCode, type);
      if (response?.imageUrl) {
        setProfilePic(response.imageUrl); // Update profile pic after successful upload
      } else {
        console.error("Error uploading profile picture");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await RemoveBillUrl(data?.employeeCode);
      if (response) {
        setProfilePic(null);
      } else {
        console.error("Error removing profile picture");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
  };
  const showDownloadPayslipModal = () => {
    setOpenDownloadPayslipModal(true);
  };
  const closeDownloadPayslipModal = () => {
    setOpenDownloadPayslipModal(false);
  };

  const downloadPayslip = async () => {
    try {
      const response = await DownloadPayslip(
        data.employeeBasicDetailId,
        selectedYear,
        selectedMonth - 1
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `payslip_${selectedMonth}-${selectedYear}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      closeDownloadPayslipModal();
    } catch (error) {
      console.error("Error downloading payslip:", error);
      Toaster(
        "error",
        "Payslip is not available for the selected month, Please contact HR team"
      );
    }
  };

  // Handle input changes for personal details
  const handlePersonalDetailsChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for contact details
  const handleContactDetailsChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for bank details
  const handleBankDetailsChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;
    if (name === "bankAccountNo") {
      // Remove any character that is not a letter or number
      updatedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    }
    setData((prev) => ({
      ...prev,
      employeeBankDetailsEntity: {
        ...prev.employeeBankDetailsEntity,
        [name]: updatedValue,
      },
    }));
  };

  // Handle input changes for employment details
  const handleEmploymentDetailsChange = (event) => {
    const { name, value } = event.target;
    if (name === "role") {
      const newRoleValue = Array.isArray(value) ? value : [value];
      setRoleChanged(
        JSON.stringify(newRoleValue) !== JSON.stringify(originalRole)
      );
    }
    if (name === "workLocationCode") {
      setData((a) => ({
        ...a,
        employeeWorkLocation: {
          ...a.employeeWorkLocation,
          workLocationCode: value,
        },
      }));
    }
    setData((prev) => ({
      ...prev,
      [name]:
        name === "role" ? (Array.isArray(value) ? value : [value]) : value,
    }));
  };

  // Handle input changes for address details
  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    const addressMatch = name.match(
      /(addressType|addressLine1|addressLine2|district|pinCode|state|country)-(\d+)/
    );
    if (addressMatch) {
      const [, field, index] = addressMatch;
      const newAddresses = [...data.employeeAddressEntityList];
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: value,
      };
      setData({ ...data, employeeAddressEntityList: newAddresses });
    }
  };

  // Handle updating all details
  const handleUpdateAllDetails = () => {
    if (tabValue === 5) {
      const payrollDetails = Object.entries(payrollData)
        .filter((entry) => entry[1].amount)
        .map((entry) => ({
          id: entry[1].id,
          employeeId: data.employeeBasicDetailId,
          configCode: entry[0],
          amount: entry[1].amount,
          modifiedBy: employeeData?.emailId,
        }));
      SaveorUpdatePayslipDetails(payrollDetails)
        .then(() => Toaster("success", "Payroll details updated successfully"))
        .catch(() => Toaster("error", "Failed to update payroll details"));
      return;
    }
    if (roleChanged && data.employeeCode) {
      updateRoleTypes({
        roleTypes: data.role,
        employeeCode: data.employeeCode,
      })
        .then(() => Toaster("success", "Roles updated successfully"))
        .catch(() => Toaster("error", "Failed to update roles"));
    }

    CreateOrUpdateEmployee({
      ...data,
      employeeId: data.employeeBasicDetailId,
      employeeAddress: data.employeeAddressEntityList,
      employeeBankDetails: data.employeeBankDetailsEntity,
      user: employeeData?.emailId,
    })
      .then((_res) => {
        Toaster("success", "Details updated");
        setOriginalRole(data.role);
        setRoleChanged(false);
      })
      .catch((_err) => {
        Toaster("error", "Failed to update details");
      });
  };

  // Handle offboarding employee
  const handleOffBoaridng = () => {
    OffboardMember({
      employeeId: data?.employeeBasicDetailId,
      lastWorkingDay: data?.lastWorkingDay.format("YYYY-MM-DD"),
    })
      .then((res) => {
        if (res) {
          Toaster("success", "Employee successfully marked as offboarded");
          setData(null);
        }
      })
      .catch((_err) => {
        Toaster("error", "Failed to offboard employee");
      });
  };

  // Open modal for confirmation
  const openModal = () => {
    setOpenOffboardModal(true);
  };

  // Close modal without action
  const closeModal = () => {
    setData((prev) => ({
      ...prev,
      lastWorkingDay: null,
    }));
    setOpenOffboardModal(false);
  };

  // Confirm offboarding and close modal
  const confirmOffboarding = () => {
    if (!data.lastWorkingDay) {
      Toaster("error", "Please select last working Date");
      return;
    }
    handleOffBoaridng();
    closeModal();
  };

  // Function to render address details panel
  const AddressDetailsPanel = (addresses, onAddressChange) => {
    return (
      <>
        {(addresses.length > 0 ? addresses : [{}, {}]).map((address, index) => (
          <Box key={index} mb={2} p={2} border={1} borderColor="grey.300">
            <ConfigureForm
              data={[
                {
                  type: "dropDownList",
                  name: `addressType-${index}`,
                  label: "Address Type",
                  value:
                    address?.addressType ||
                    (index === 0 ? "Permanent" : "Current"), // Set default values "Permanent" for the first and "Current" for the second form
                  options: [
                    { key: "Permanent", value: "Permanent" },
                    { key: "Current", value: "Current" },
                  ],
                  disable: true,
                },
                {
                  type: "text",
                  name: `addressLine1-${index}`,
                  label: "Address Line 1",
                  value: address?.addressLine1 || "", // Default to empty string if no value
                },
                {
                  type: "text",
                  name: `addressLine2-${index}`,
                  label: "Address Line 2",
                  value: address?.addressLine2 || "", // Default to empty string if no value
                },
                {
                  type: "text",
                  name: `pinCode-${index}`,
                  label: "Pin Code",
                  value: address?.pinCode || "", // Default to empty string if no value
                },
                {
                  type: "text",
                  name: `state-${index}`,
                  label: "State",
                  value: address?.state || "", // Default to empty string if no value
                },
                {
                  type: "text",
                  name: `country-${index}`,
                  label: "Country",
                  value: address?.country || "", // Default to empty string if no value
                },
              ]}
              handleChange={onAddressChange}
              actionsHide={false}
              readOnly={readOnly}
            />
          </Box>
        ))}
      </>
    );
  };
  const additionPayrollDetails = (d) => {
    const additions = Object.entries(d)
      ?.filter((a) => a[1].amountType === "ADDITION")
      .map((entry) => ({
        type: "text",
        name: entry[0],
        label: entry[1].labelName,
        value: entry[1].amount,
      }));

    const totalAdditions = additions.reduce((total, entry) => {
      const numericValue = parseFloat(entry.value);
      return total + (isNaN(numericValue) ? 0 : numericValue); // If not a valid number, treat it as 0
    }, 0);

    return { additions, totalAdditions };
  };

  const deductionPayrollDetails = (d) => {
    const deductions = Object.entries(d)
      ?.filter((a) => a[1].amountType === "DEDUCTION")
      .map((entry) => ({
        type: "text",
        name: entry[0],
        label: entry[1].labelName,
        value: entry[1].amount,
      }));

    const totalDeductions = deductions.reduce((total, entry) => {
      const numericValue = parseFloat(entry.value);

      return total + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    return { deductions, totalDeductions };
  };

  // Function to handle change in payroll details (value update and validation)
  const handlePayrollDetailsChange = (event) => {
    const { name, value } = event.target;

    // Assuming the integerNotNullValidation function checks for valid integer input
    if (value && !integerNotNullValidation(value)) return;

    // Update the payroll data with the new value
    setPayrollData((prevPayrollDetails) => ({
      ...prevPayrollDetails,
      [name]: { ...prevPayrollDetails[name], amount: value.trim() },
    }));
  };

  // Main Component to Render Payroll Form
  const PayrollDetails = () => {
    const { additions, totalAdditions } = additionPayrollDetails(payrollData);
    const { deductions, totalDeductions } =
      deductionPayrollDetails(payrollData);

    return (
      <Box className="flex flex-row justify-center justify-items-start w-full">
        <Box className="w-1/2">
          <ConfigureForm
            data={additions}
            handleChange={handlePayrollDetailsChange}
            actionsHide={false}
            readOnly={readOnly}
            title="Additions"
          />
          <div className="mt-2">
            <strong>Total Additions: </strong>
            {totalAdditions.toLocaleString()}{" "}
            {/* Format the number with commas */}
          </div>
        </Box>
        <Box className="w-1/2">
          <ConfigureForm
            data={deductions}
            handleChange={handlePayrollDetailsChange}
            actionsHide={false}
            readOnly={readOnly}
            title="Deductions"
          />
          <div className="mt-2">
            <strong>Total Deductions: </strong>
            {totalDeductions.toLocaleString()}{" "}
            {/* Format the number with commas */}
          </div>
        </Box>
      </Box>
    );
  };

  return (
    data && (
      <Box display="flex" margin="1%">
        <ProfilePic
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          onImageSelect={handleImageSelect} // Optional
          onRemoveImage={handleRemoveImage} // Optional
        />
        <VerticalTabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          aria-label="employee details tabs"
        >
          <SmallTab label="Personal Details" />
          <SmallTab label="Contact Details" />
          <SmallTab label="Employment Details" />
          <SmallTab label="Address Details" />
          {(data.workType === "permanent" ||
            (data.workType === "contract" &&
              data.workLocationCode !== "WL003")) && (
            <SmallTab label="Bank Details" />
          )}
          {data.workType === "permanent" && (
            <SmallTab label="Payroll Details" />
          )}
        </VerticalTabs>

        <Box flex={1} p={2}>
          {tabValue === 0 && (
            <ConfigureForm
              data={[
                {
                  type: "text",
                  name: "employeeCode",
                  label: "Employee Code",
                  value: data.employeeCode,
                  readOnly: true,
                },
                {
                  type: "text",
                  name: "firstName",
                  label: "First Name",
                  value: data.firstName,
                },
                {
                  type: "text",
                  name: "middleName",
                  label: "Middle Name",
                  value: data.middleName,
                },
                {
                  type: "text",
                  name: "lastName",
                  label: "Last Name",
                  value: data.lastName,
                },
                {
                  type: "datePicker",
                  name: "dob",
                  label: "Date of Birth",
                  value: dayjs(data.dob),
                  maxDate: dayjs(),
                  readOnly: true,
                },
                {
                  type: "dropDownList",
                  name: "gender",
                  label: "Gender",
                  value: data.gender,
                  options: [
                    { key: "male", value: "Male" },
                    { key: "female", value: "Female" },
                    { key: "other", value: "Other" },
                  ],
                },
                {
                  type: "dropDownList",
                  name: "maritalStatus",
                  label: "Marital Status",
                  value: data.maritalStatus,
                  options: [
                    { key: "single", value: "Single" },
                    { key: "married", value: "Married" },
                    { key: "divorced", value: "Divorced" },
                    { key: "widowed", value: "Widowed" },
                  ],
                },
                ...(data.employeeWorkLocation?.workLocationCode !== "WL003"
                  ? [
                      {
                        type: "text",
                        name: "uanNo",
                        label: "UAN No",
                        value: data.uanNo,
                      },
                    ]
                  : []),
              ]}
              handleChange={handlePersonalDetailsChange}
              actionsHide={false}
              readOnly={readOnly}
            />
          )}

          {tabValue === 1 && (
            <ConfigureForm
              data={[
                {
                  type: "text",
                  name: "personalEmail",
                  label: "Email",
                  value: data.personalEmail,
                },
                {
                  type: "text",
                  name: "mobileNo",
                  label: "Phone Number",
                  value: data.mobileNo,
                },
                {
                  type: "number",
                  maxLength: 10,
                  name: "alternateNumber",
                  label: "Alternate Number",
                  value: data.alternateNumber,
                },
                {
                  type: "text",
                  name: "emergencyNo",
                  label: "Emergency Number",
                  value: data.emergencyNo,
                },
              ]}
              handleChange={handleContactDetailsChange}
              actionsHide={false}
              readOnly={readOnly}
            />
          )}

          {tabValue === 2 && (
            <ConfigureForm
              data={[
                {
                  type: "dropDownList",
                  name: "workLocationCode",
                  label: "Work Location",
                  value: data.employeeWorkLocation?.workLocationCode,
                  options: apiData?.workLocation.map((a) => ({
                    key: a.workLocationCode,
                    value: a.workLocation,
                  })),
                },
                {
                  type: "dropDownList",
                  name: "designation",
                  label: "Designation",
                  value: data.designation,
                  options: apiData?.designations?.map((a) => ({
                    key: a.designationCode,
                    value: a.designationDescription,
                  })),
                },
                {
                  type: "text",
                  name: "emailId",
                  label: "Email ID",
                  value: data.emailId,
                  readOnly: true,
                },
                {
                  type: "text",
                  name: "workType",
                  label: "Employment Type",
                  value:
                    data.workType === "permanent" ? "Permanent" : "Contract",
                  readOnly: true,
                },
                {
                  type: "dropDownList",
                  name: "group",
                  label: "Group",
                  value: data.group,
                  options: apiData?.groups?.res?.map((a) => ({
                    key: a.groupName,
                    value: a.description,
                  })),
                },
                {
                  type: "dropDownList",
                  name: "subGroup",
                  label: "Sub Group",
                  value: data.subGroup,
                  options: apiData?.groups?.res
                    ?.find((a) => a.groupName === data.group)
                    ?.subGroupDetails?.map((a) => ({
                      key: a.subGroupName,
                      value: a.description,
                    })),
                },

                {
                  type: "datePicker",
                  name: "dateOfJoining",
                  label: "Joining Date",
                  value: dayjs(data.dateOfJoining),
                  maxDate: dayjs(),
                },
                {
                  type: "datePicker",
                  name: "lastWorkingDay",
                  label: "Last Working Day",
                  value: data.lastWorkingDay
                    ? dayjs(data.lastWorkingDay)
                    : undefined,
                },
                {
                  type: "multiSelect",
                  name: "role",
                  label: "Role Name",
                  value: data.role || [], // Default to empty array if no role selected
                  options: allRoleTypes.map((role) => ({
                    key: role.roleTypeCode,
                    value: role.roleType,
                    disabled: role.roleType === "Employee",
                  })),
                },
              ].filter((d) => {
                if (!data.lastWorkingDay) {
                  return d.name !== "lastWorkingDay";
                } else {
                  return true;
                }
              })}
              handleChange={handleEmploymentDetailsChange}
              actionsHide={false}
              readOnly={readOnly}
            />
          )}
          {tabValue === 3 &&
            AddressDetailsPanel(
              data.employeeAddressEntityList,
              handleAddressChange
            )}
          {tabValue === 4 &&
            (data.workType === "permanent" ||
              (data.workType === "contract" &&
                data.workLocationCode !== "WL003")) && (
              <ConfigureForm
                data={[
                  {
                    type: "dropDownList",
                    name: "accountType",
                    label: "Account Type",
                    value: data?.employeeBankDetailsEntity?.accountType || "",
                    options: [
                      { key: "savings", value: "Savings" },
                      { key: "current", value: "Current" },
                      { key: "fixed deposit", value: "Fixed Deposit" },
                      { key: "loan", value: "Loan" },
                      { key: "other", value: "Other" },
                    ],
                  },
                  {
                    type: "text",
                    name: "bankAccountNo",
                    label: "Bank Account No",
                    value: data?.employeeBankDetailsEntity?.bankAccountNo || "",
                  },
                  {
                    type: "text",
                    name: "bankIfsc",
                    label: "IFSC Code",
                    value: data?.employeeBankDetailsEntity?.bankIfsc || "",
                  },
                  {
                    type: "text",
                    name: "bankName",
                    label: "Bank Name",
                    value: data?.employeeBankDetailsEntity?.bankName || "",
                  },
                  {
                    type: "text",
                    name: "branchName",
                    label: "Branch Name",
                    value: data?.employeeBankDetailsEntity?.branchName || "",
                  },
                  {
                    type: "text",
                    name: "bankAddress",
                    label: "Bank Address",
                    value: data?.employeeBankDetailsEntity?.bankAddress || "",
                  },
                ]}
                handleChange={handleBankDetailsChange}
                actionsHide={false}
                readOnly={readOnly}
              />
            )}
          {
            // Payroll Details
            tabValue === 5 && data.workType === "permanent" && PayrollDetails()
          }
          {!isFieldDisabled && (
            <Box textAlign="right" mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginRight: "1rem",
                }}
                onClick={showDownloadPayslipModal}
              >
                Download Payslip
              </Button>
              {data?.status !== "117" && (
                <>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={openModal}
                    sx={{
                      marginRight: "1rem",
                    }}
                  >
                    Offboard Member
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateAllDetails}
                  >
                    Update
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
        <Dialog open={openOffboardModal} onClose={closeModal}>
          <DialogTitle>Confirm Offboarding</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to offboard this employee? This action
              cannot be undone. If yes, please enter Last working date.
            </DialogContentText>
            <ConfigureForm
              data={[
                {
                  type: "datePicker",
                  name: "lastWorkingDay",
                  label: "Last Working Date",
                  value: data.lastWorkingDay
                    ? dayjs(data.lastWorkingDay)
                    : undefined,
                },
              ]}
              handleChange={handleEmploymentDetailsChange}
              actionsHide={false}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmOffboarding} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDownloadPayslipModal}
          onClose={closeDownloadPayslipModal}
        >
          <DialogTitle>Download Payslip</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              fullWidth
              style={{ marginTop: "16px" }}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              fullWidth
              style={{ marginTop: "16px" }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDownloadPayslipModal} color="primary">
              Cancel
            </Button>
            <Button onClick={downloadPayslip} color="secondary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
}

export default EmployeeDetails;
