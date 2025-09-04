import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  fabClasses,
  useMediaQuery,
} from "@mui/material";
import {
  AddCircle,
  FileDownloadSharp,
  IndeterminateCheckBox,
  RemoveCircle,
} from "@mui/icons-material";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import {
  createCandidate,
  DownloadFile,
  getCandidateById,
  updateCandidate,
  uploadOfferLetter,
  SendOfferLetter,
  OnboardCandidate,
  createOrUpdateCandidate,
} from "../../../service/api/NexushireService/nexusHire";
import { useParams } from "react-router-dom";
import { CreateOrUpdateEmployee } from "../../../service/api/nemsService/EmployeeService";
import { UserManagentCheck } from "../../../common/UserManagement";
import { useLocation } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled, useTheme } from "@mui/material/styles";
import { GetAllDesignations } from "../../../service/api/DesinationService";
import { GetGroups } from "../../../service/api/pmsService/GetGroups";
import {
  GetAllCountries,
  GetDetailsByPincode,
  GetDocumentsByCountryCode,
} from "../../../service/api/MasterData";
import { Toaster } from "../../../common/alertComponets/Toaster";
import {
  integerNotNullValidation,
  stringNotNullValidation,
  validateAadhaar,
  validateDayjsDate,
  validateEmail,
  validatePan,
  validatePhoneNumber,
  validatePostalCode,
  validateUAN,
  validateAlphabets,
  isValidGradeMarks,
} from "../../../common/commonValidation/CommonValidation";
import dayjs, { isDayjs, min } from "dayjs";
import { useNavigate } from "react-router-dom";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllWorkLocation } from "../../../service/api/hrConfig/hrConfig";
import ProgressBar from "./ProgressBar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ActionButton from "./ActionButton";
import { UploadExpense } from "../../../service/api/ExpenseService";

function CandidateForm() {
  const [currentAddress, setCurrentAddress] = useState({
    line1: "",
    postalCode: 0,
    city: "",
    state: "",
    country: "",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    line1: "",
    postalCode: 0,
    state: "",
    city: "",
    country: "",
  });

  const { employeeData } = useContext(EmployeeDataContext);

  const defaultFormData = {
    requirementId: "",
    requirementDesc: "",
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddres: "",
    primaryMobileNo: "",
    alternateMobileNo: "",
    emergencyMobileNo: "",
    gender: "",
    dob: "",
    doj: "",
    priority: "",
    primarySkill: "",
    nationality: "IND",
    workLocation: "",
    aadhaarNo: "",
    panId: "",
    documentType: "",
    documentNumber: "",
    passportNumber: "",
    expiry: "",
    visa: "",
    visaCountry: "",
    visaExpiry: "",
    showPassport: false,
    showVisa: false,
    documents: {},
    addresses: [
      {
        ...currentAddress,
        type: "Current",
      },
      {
        ...permanentAddress,
        type: "Permanent",
      },
    ],
    sameAsPermanent: false,
    educations: [
      {
        institute: "",
        eduState: "",
        university: "",
        eduCountry: "",
        degree: "",
        mode: "",
        completedOn: "",
      },
    ],
    employments: [
      {
        employer: "",
        empFrom: "",
        empTo: "",
        ctc: "",
        noticePeriod: "",
        address: "",
        reason: "",
      },
    ],
    expectedCtc: "",
    budget: "",
    grantedCtc: "",
    workflowStatus: "",
    status: "",
    budgetStatus: "",
    managementStatus: "",
    managementComment: "",
    budgetComment: "",
    initiateOnboard: false,
    createdBy: employeeData?.employeeCode,
    createdDate: "",
    modifiedBy: "",
    employmentType: "",
    ctcType: "",
    vendorName: "",
  };

  const defaultEducationError = {
    institute: "",
    state: "",
    university: "",
    country: "",
    degree: "",
    mode: "",
    completedOn: "",
  };
  const defaultEmploymentError = {
    employer: "",
    empFrom: "",
    empTo: "",
    ctc: "",
    noticePeriod: "",
    address: "",
    reason: "",
  };
  const mapFormDataToEmployeeModel = (
    formData,
    onBoardData,
    currentAddress,
    permanentAddress
  ) => {
    return {
      firstName: formData.firstName,
      middleName: formData.middleName, // Assuming empty middle name is valid
      lastName: formData.lastName,
      gender: formData.gender,
      dob:
        typeof formData.dob === "string"
          ? formData.dob
          : formData.dob.format("YYYY-MM-DD"), // Ensure this is in LocalDate format
      designation: onBoardData.designation,
      maritalStatus: onBoardData.maritalStatus,
      nationality: formData.nationality,
      mobileNo: formData.primaryMobileNo,
      alternateNumber: formData.alternateMobileNo,
      emergencyNo: formData.emergencyMobileNo,
      personalEmail: formData.emailAddres,
      bloodGroup: onBoardData.bloodGroup,
      panNo: formData.panId,
      adharNo: formData.aadhaarNo,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      workType: formData.employmentType,
      vendorName: formData.vendorName,
      ctcType: formData.ctcType,
      uanNo: onBoardData.uan,
      createdDate: null, // If this needs to be a LocalDateTime, ensure handling
      createdBy: "",
      modifiedBy: "",
      modifiedDate: null, // If this needs to be a LocalDateTime, ensure handling
      status: "110", // Ensure "110" is a valid status
      workflowStatus: "",
      dateOfJoining: new Date(), // Ensure this is a LocalDate
      lastWorkingDay: formData.lastWorkingDay || null, // Ensure this is a LocalDate
      group: onBoardData.group || "", // Added group
      subGroup: onBoardData.subGroup || "", // Added subGroup
      jiraId: onBoardData.jiraID || "",
      ctc: formData.grantedCtc,
      passportAndVisaDetail: {
        passportNumber: formData.passportNumber,
        passportExpiry: formData.expiry,
        visaNumber: formData.visa,
        visaCountry: formData.visaCountry,
        visaExpiry: formData.visaExpiry,
      },
      employeeAddress: [
        {
          addressType: currentAddress.type || "", // Ensure default value if not present
          addressLine1: currentAddress.line1 || "",
          pinCode: currentAddress.postalCode?.toString() || "", // Ensure it's a string
          city: currentAddress.city || "",
          state: currentAddress.state || "",
          country: currentAddress.country || "", // Add country if needed
        },
        {
          addressType: permanentAddress.type || "", // Ensure default value if not present
          addressLine1: permanentAddress.line1 || "",
          pinCode: permanentAddress.postalCode?.toString() || "", // Ensure it's a string
          city: permanentAddress.city || "",
          state: permanentAddress.state || "",
          country: permanentAddress.country || "", // Add country if needed
        },
      ],

      employeeWorkLocation: {
        workLocationCode: formData.workLocation,
      },
      user: "", // Set the user field if applicable
    };
  };

  const candidateOnBoardData = {
    uan: "",
    bloodGroup: "",
    maritalStatus: "",
    designation: "",
    group: "",
    subGroup: "",
    jiraID: "",
  };
  console.log("EmployeeDataContext", employeeData?.employeeCode);

  const { candidateId: urlCandidateId } = useParams();
  const [candidateId, setCandidateId] = useState();

  const [workflowStatusDescription, setWorkflowStatusDescription] =
    useState("Default Status");

  console.log("Candidate Status", workflowStatusDescription);

  const shouldShowForm =
    workflowStatusDescription === "10" ||
    workflowStatusDescription === "203" ||
    workflowStatusDescription === "Default Status";
  console.log("Should Show Form:", shouldShowForm);

  let hrEdit = true;

  if (
    workflowStatusDescription == "203" ||
    workflowStatusDescription == "Default Status" ||
    workflowStatusDescription == "10"
  ) {
    hrEdit = false;
  }

  let hrInitiateCandidate = true;

  if (
    workflowStatusDescription == "300" ||
    workflowStatusDescription == "302"
  ) {
    hrInitiateCandidate = true;
  }

  const navigate = useNavigate();
  const [onBoardData, setOnBoardData] = useState(candidateOnBoardData);
  const [formData, setFormData] = useState(defaultFormData);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  console.log(formData);
  console.log(onBoardData);

  const [errors, setErrors] = useState({
    educations: [defaultEducationError],
    employments: [defaultEmploymentError],
    currentAddress: {
      line1: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
    },
    permanentAddress: {
      line1: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const [offerRevised, setOfferRevised] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [designationData, setDesignationData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState(null);
  const [subGroups, setSubGroups] = useState([]);
  const [code, setCode] = useState("");
  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [workLocationData, setWorkLocationData] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [tabStatus, setTabStatus] = useState({
    basicInfo: true, // Basic Info tab is always enabled
    education: false,
    employment: false,
    ctcDetails: false,
  });

  console.log(currentTab);
  const dropdownOptions = [
    { key: "approved", value: "Approved" },
    { key: "rejected", value: "Rejected" },
    { key: "exceptional_approved", value: "Exceptional Approved" },
    { key: "revise", value: "Revise" },
  ];
  const genderOptions = [
    { key: "male", value: "Male" },
    { key: "female", value: "Female" },
    { key: "others", value: "Others" },
  ];
  const educationMode = [
    { key: "full_time", value: "Full Time" },
    { key: "part_time", value: "Part Time" },
    { key: "other", value: "Other" },
  ];
  const maritalStatusData = [
    { key: "married", value: "Married" },
    { key: "single", value: "Single" },
    { key: "widowed", value: "Widowed" },
    { key: "divorced", value: "Divorced" },
  ];
  const bloodGroupData = [
    { key: "A+", value: "A+" },
    { key: "A-", value: "A-" },
    { key: "B+", value: "B+" },
    { key: "B-", value: "B-" },
    { key: "AB+", value: "AB+" },
    { key: "AB-", value: "AB-" },
    { key: "O+", value: "O+" },
    { key: "O-", value: "O-" },
  ];
  const employmentTypes = [
    { key: "w2", value: "W2" },
    { key: "c2c", value: "Corp2Corp" },
    { key: "1099", value: "1099" },
    { key: "permanent", value: "Permanent" },
    { key: "contract", value: "Contract" },
  ];
  const ctcTypes = [
    { key: "hourly", value: "Hourly" },
    { key: "annually", value: "Annually" },
  ];
  const noticePeriodData = [
    { key: "0", value: "Immediate Joiner" },
    { key: "0.5", value: "15 Days" },
    { key: "1", value: "1 Month" },
    { key: "2", value: "2 Months" },
    { key: "3", value: "3 Months" },
  ];
  const priorityData = [
    { key: "critical", value: "Critical" },
    { key: "high", value: "High" },
    { key: "low", value: "Low" },
  ];

  const [fileUrl, setFileUrl] = useState();
  const [file, setFile] = useState();

  const hr = !UserManagentCheck(
    "hr_tools_smartHire_candidate_approval_uploadOfferLetter"
  );
  const budget = !UserManagentCheck(
    "hr_tools_smartHire_candidate_approval_budgetApproval"
  );
  const management = !UserManagentCheck(
    "hr_tools_smartHire_candidate_approval_managementApproval"
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const admin = !UserManagentCheck("admin");

  console.log(formData.addresses);

  const handleChangeTab = (event, newTab) => {
    console.log("handleChangeTab", newTab);
    // Allow navigation to a tab if it's validated or going back to previous tabs
    if (newTab <= currentTab || newTab >= currentTab) {
      setCurrentTab(newTab); // Set the new active tab
    }
  };

  const fetchDesignationData = useCallback(async () => {
    try {
      const designationTypes = await GetAllDesignations();
      setDesignationData(designationTypes);
    } catch (error) {
      console.error("Failed to fetch designation data", error);
    }
  }, []);

  const fetchGroupsData = useCallback(async () => {
    try {
      const response = await GetGroups();
      setGroups(response.res || []);
      console.log("Groups fetched", response);
    } catch (error) {
      console.error("Failed to fetch group data", error);
    }
  }, []);

  useEffect(() => {
    fetchGroupsData();
  }, [fetchGroupsData]);

  const fetchAllCountries = useCallback(async () => {
    try {
      const response = await GetAllCountries();
      setCountries(response || []);
      console.log("Countries fetched", countries.length);
    } catch (error) {
      console.error("Failed to fetch country data", error);
    }
  }, []);

  useEffect(() => {
    fetchAllCountries();
  }, [fetchAllCountries]);

  const fetchWorkLocation = useCallback(async () => {
    try {
      const response = await GetAllWorkLocation();
      console.log("Work location", response);
      setWorkLocationData(response || []);
      console.log("Work location", workLocationData.length);
    } catch (error) {
      console.error("Failed to fetch country data", error);
    }
  }, []);

  useEffect(() => {
    fetchWorkLocation();
  }, [fetchWorkLocation]);

  const fetchDocumentByCode = useCallback(async (code) => {
    try {
      const response = await GetDocumentsByCountryCode(code);

      console.log("Documents fetched", response);
      setDocuments(response || []);
      console.log("Documents", documents.length);
      response.forEach((doc) => {
        console.log("Document name", doc.document);
      });
    } catch (error) {
      console.error("Failed to fetch holidays data", error);
    }
  }, []);

  useEffect(() => {
    fetchDocumentByCode(formData.nationality);
  }, [fetchDocumentByCode, formData.nationality]);

  useEffect(() => {
    fetchDesignationData();
    console.log(designationData);
  }, [fetchDesignationData]);

  const fetchDetailsByPincode = useCallback(
    async (pincode, addressType) => {
      try {
        const response = await GetDetailsByPincode(pincode);
        console.log("Details fetched", response);

        // Update based on the addressType
        if (addressType === "permanentAddress") {
          setPermanentAddress((prev) => ({
            ...prev,
            postalCode: pincode,
            city: response.cityName || "",
            state: response.stateName || "",
            country: response.countryName || "",
          }));
          console.log("permanentAddress", permanentAddress);
          // If the sameAsPermanent checkbox is checked, update currentAddress as well
          if (formData.sameAsPermanent) {
            setCurrentAddress((prev) => ({
              ...prev,
              postalCode: pincode,
              city: response.cityName || "",
              state: response.stateName || "",
              country: response.countryName || "",
            }));
          }
        } else if (addressType === "currentAddress") {
          setCurrentAddress((prev) => ({
            ...prev,
            postalCode: pincode,
            city: response.cityName || "",
            state: response.stateName || "",
            country: response.countryName || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch pincode data", error);
      }
    },
    [formData.sameAsPermanent]
  );

  const configureRequirementInfo = useCallback(
    (formData, errors) => [
      {
        label: "Requirement ID",
        name: "requirementId",
        type: "text",
        value: formData.requirementId,
        error: errors.requirementId,
        required: true,
      },
      {
        label: "Requirement Description",
        name: "requirementDesc",
        type: "text",
        value: formData.requirementDesc,
        error: errors.requirementDesc,
        required: true,
      },
      {
        label: "Work Location",
        name: "workLocation",
        type: "dropDownList",
        value: formData.workLocation,
        options: workLocationData.map((workLocation) => ({
          key: workLocation.workLocationCode,
          value: workLocation.workLocation,
        })),
        error: errors.workLocation,
        required: true,
      },
      {
        label: "Priority",
        name: "priority",
        type: "dropDownList",
        value: formData.priority,
        options: priorityData,
        error: errors.priority,
        required: true,
      },
      {
        label: "Date of Joining",
        name: "doj",
        type: "datePicker",
        value: dayjs(formData.doj),
        error: errors.doj,
        minDate: dayjs(),
        required: true,
      },
    ],
    [errors, workLocationData, priorityData]
  );

  const configurePersonalInfo = useCallback(
    (formData, errors) => [
      {
        label: "First Name",
        name: "firstName",
        type: "text",
        value: formData.firstName,
        error: errors.firstName,
        required: true,
      },
      {
        label: "Middle Name",
        name: "middleName",
        type: "text",
        value: formData.middleName,
        error: errors.middleName,
      },
      {
        label: "Last Name",
        name: "lastName",
        type: "text",
        value: formData.lastName,
        error: errors.lastName,
        required: true,
      },
      {
        label: "Date of Birth",
        name: "dob",
        type: "datePicker",
        value: dayjs(formData.dob),
        error: errors.dob,
        maxDate: dayjs(),
        required: true,
      },
      {
        label: "Gender",
        name: "gender",
        type: "dropDownList",
        value: formData.gender,
        error: errors.gender,
        options: genderOptions,
        required: true,
      },
      {
        label: "Email Address",
        name: "emailAddres",
        type: "text",
        value: formData.emailAddres,
        error: errors.emailAddres,
        required: true,
      },
      {
        label: "Primary Mobile No",
        name: "primaryMobileNo",
        type: "number",
        maxLength: 10,
        value: formData.primaryMobileNo,
        error: errors.primaryMobileNo,
        required: true,
      },
      {
        label: "Alternate Mobile No",
        name: "alternateMobileNo",
        type: "number",
        maxLength: 10,
        value: formData.alternateMobileNo,
        error: errors.alternateMobileNo,
      },
      {
        label: "Emergency Mobile No",
        name: "emergencyMobileNo",
        type: "number",
        required: true,
        maxLength: 10,
        value: formData.emergencyMobileNo,
        error: errors.emergencyMobileNo,
      },
      {
        label: "Primary Skill",
        name: "primarySkill",
        type: "text",
        value: formData.primarySkill,
        error: errors.primarySkill,
        required: true,
      },
      {
        label: "Employment Type",
        name: "employmentType",
        type: "dropDownList",
        value: formData.employmentType,
        error: errors.employmentType,
        options: employmentTypes,
        required: true,
      },
      {
        label: "Vendor Name",
        name: "vendorName",
        type: "text",
        value: formData.vendorName,
        error: errors.vendorName,
      },
      {
        label: "Nationality",
        name: "nationality",
        type: "dropDownList",
        value: formData.nationality || "IND",
        options: countries.map((country) => ({
          key: country.countryCode,
          value: country.countryName,
        })),
        error: errors.nationality,
        required: true,
      },
    ],
    [errors, countries]
  );

  const configureDocumentDetails = useCallback(
    (formData, errors) => {
      const fields = [];
      console.log(formData.nationality);

      // Check if nationality is India
      if (formData.nationality === "IND") {
        fields.push(
          {
            label: "Aadhar card number",
            name: "aadhaarNo",
            type: "number",
            maxLength: 12,
            value: formData.aadhaarNo,
            error: errors.aadhaarNo,
            required: false,
          },
          {
            label: "Pan card number",
            name: "panId",
            type: "text",
            maxLength: 10,
            value: formData.panId,
            error: errors.panId,
            required: true,
          }
        );
      }

      // Check if nationality is USA
      if (formData.nationality === "USA") {
        fields.push(
          {
            label: "Document Type",
            name: "documentType",
            type: "text",
            value: formData.documentType,
            error: errors.documentType,
            required: false,
          },
          {
            label: "Document Number",
            name: "documentNumber",
            type: "text",
            value: formData.documentNumber,
            error: errors.documentNumber,
            required: false,
          }
        );
      }

      return fields;
    },
    [errors]
  );

  const configureShowPassport = useCallback(
    (formData, errors) => {
      const fields = [
        {
          label: "Passport",
          name: "showPassport",
          type: "checkbox",
          value: formData.showPassport,
          error: errors.showPassport,
          required: false,
        },
      ];

      if (formData.showPassport) {
        fields.push(
          {
            label: "Passport Number",
            name: "passportNumber",
            type: "text",
            value: formData.passportNumber,
            error: errors.passportNumber,
            required: false,
          },
          {
            label: "Expiry",
            name: "expiry",
            type: "monthAndYearSelect", // or 'text' based on your requirements
            value: dayjs(formData.expiry),
            error: errors.expiry,
            required: false,
          }
        );
      }

      return fields; // Return the fields array
    },
    [errors] // Include errors in the dependency array
  );

  const configureShowVisa = useCallback(
    (formData, errors) => {
      const fields = [
        {
          label: "Show Visa",
          name: "showVisa",
          type: "checkbox",
          value: formData.showVisa,
          error: errors.showVisa,
          required: false,
        },
      ];

      // Add Visa fields if the checkbox is checked
      if (formData.showVisa) {
        fields.push(
          {
            label: "Visa",
            name: "visa",
            type: "text",
            value: formData.visa,
            error: errors.visa,
            required: false,
          },
          {
            label: "Visa Country",
            name: "visaCountry",
            type: "text",
            value: formData.visaCountry,
            error: errors.visaCountry,
            required: false,
          },
          {
            label: "Visa Expiry",
            name: "visaExpiry",
            type: "monthAndYearSelect", // or 'text' based on your requirements
            value: dayjs(formData.visaExpiry),
            error: errors.visaExpiry,
            required: false,
          }
        );
      }

      return fields; // Return the fields array
    },
    [errors] // Include errors in the dependency array
  );

  const configurePermanentAddress = useCallback(
    (permanentAddress, errors) => {
      const fields = [
        {
          label: "Address Line 1",
          name: "line1",
          type: "text",
          // value: candidateId ? formData.addresses[1].line1 : formData.line1,
          value: permanentAddress.line1,
          error: errors.permanentAddress?.line1,
          required: true,
        },
        {
          label: "ZIP Code",
          name: "postalCode",
          type: "text",
          // value: candidateId
          //   ? formData.addresses[1].postalCode
          //   : formData.postalCode,
          value: permanentAddress.postalCode,
          error: errors.permanentAddress?.postalCode,
          required: true,
        },
        {
          label: "City",
          name: "city",
          type: "text",
          // value: candidateId ? formData.addresses[1].state : formData.state,
          value: permanentAddress.city,
          error: errors.permanentAddress?.city,
          required: true,
        },
        {
          label: "State",
          name: "state",
          type: "text",
          // value: candidateId ? formData.addresses[1].state : formData.state,
          value: permanentAddress.state,
          error: errors.permanentAddress?.state,
          required: true,
        },
        {
          label: "Country",
          name: "country",
          type: "text",
          // value: candidateId ? formData.addresses[1].country : formData.country,
          value: permanentAddress.country,
          error: errors.permanentAddress?.country,
          required: true,
        },
      ];

      return fields;
    },
    [errors, candidateId]
  );

  const configureSameAsPermanent = useCallback(
    (formData, errors) => [
      {
        label: "Same as Permanent Address",
        name: "sameAsPermanent",
        type: "checkbox",
        value: formData.sameAsPermanent, // Ensure value is boolean
        error: errors.sameAsPermanent,
      },
    ],
    [errors]
  );

  const configureCurrentAddress = useCallback(
    (formData, errors) => [
      {
        label: "Address Line 1",
        name: "line1",
        type: "text",
        value: formData.sameAsPermanent
          ? permanentAddress.line1
          : currentAddress.line1,
        error: errors.currentAddress?.line1,
        required: true,
      },
      {
        label: "ZIP Code",
        name: "postalCode",
        type: "text",
        value: formData.sameAsPermanent
          ? permanentAddress.postalCode
          : currentAddress.postalCode,
        error: errors.currentAddress?.postalCode,
        required: true,
      },
      {
        label: "City",
        name: "city",
        type: "text",
        // value: candidateId ? formData.addresses[1].state : formData.state,
        value: formData.sameAsPermanent
          ? permanentAddress.city
          : currentAddress.city,
        error: errors.currentAddress?.city,
        required: true,
      },
      {
        label: "State",
        name: "state",
        type: "text",
        value: formData.sameAsPermanent
          ? permanentAddress.state
          : currentAddress.state,
        error: errors.currentAddress?.state,
        required: true,
      },
      {
        label: "Country",
        name: "country",
        type: "text",
        value: formData.sameAsPermanent
          ? permanentAddress.country
          : currentAddress.country,
        error: errors.currentAddress?.country,
        required: true,
      },
    ],
    [permanentAddress, currentAddress, errors]
  );

  const configureEducationData = useCallback(
    (errors, i) => {
      const edu = formData.educations;
      return [
        {
          label: "Institute",
          name: "institute",
          type: "text",
          value: edu[i].institute,
          error: errors.educations[i]?.institute,
          required: true,
        },
        {
          label: "University",
          name: "university",
          type: "text",
          value: edu[i]?.university,
          error: errors.educations[i]?.university,
          required: true,
        },
        {
          label: "State",
          name: "eduState",
          type: "text",
          value: edu[i].eduState,
          error: errors.educations[i]?.eduState,
          required: true,
        },
        {
          label: "Country",
          name: "eduCountry",
          type: "text",
          value: edu[i].eduCountry,
          error: errors.educations[i]?.eduCountry,
          required: true,
        },
        {
          label: "Degree",
          name: "degree",
          type: "text",
          value: edu[i].degree,
          error: errors.educations[i]?.degree,
          required: true,
        },
        {
          label: "Mode",
          name: "mode",
          type: "dropDownList",
          value: edu[i].mode,
          error: errors.educations[i]?.mode,
          options: educationMode,
          required: true,
        },
        {
          label: "Completed On",
          name: "completedOn",
          type: "monthAndYearSelect",
          value: dayjs(edu[i].completedOn),
          maxDate: dayjs(),
          error: errors.educations[i]?.completedOn,
          required: true,
        },
        {
          label: "Grade/Marks/Percentage",
          name: "gradeMarks",
          type: "text",
          value: edu[i].gradeMarks,
          error: errors.educations[i]?.gradeMarks,
          required: true,
        },
      ];
    },
    [errors, formData]
  );

  const configureEmploymentData = useCallback(
    (errors, i) => {
      const emp = formData.employments;
      return [
        {
          label: "Employer",
          name: "employer",
          type: "text",
          value: emp[i].employer,
          error: errors.employments[i]?.employer,
        },
        {
          label: "From",
          name: "empFrom",
          type: "monthAndYearSelect",
          value: dayjs(emp[i].empFrom),
          maxDate: dayjs(),
          error: errors.employments[i]?.empFrom,
        },
        {
          label: "To",
          name: "empTo",
          type: "monthAndYearSelect",
          value: dayjs(emp[i].empTo),
          minDate: emp[i].empFrom ? dayjs(emp[i].empFrom) : undefined,
          maxDate: i === 0 ? dayjs().add(3, "months") : dayjs(),
          error: errors.employments[i]?.empTo,
        },
        {
          label: "CTC",
          name: "ctc",
          type: "number",
          value: emp[i].ctc,
          error: errors.employments[i]?.ctc,
        },
        ...(i === 0
          ? [
              {
                label: "Notice Period",
                name: "noticePeriod",
                type: "dropDownList",
                value: emp[i].noticePeriod,
                options: noticePeriodData,
                error: errors.employments[i]?.noticePeriod,
              },
            ]
          : []),
        {
          label: "Address",
          name: "address",
          type: "text",
          value: emp[i].address,
          error: errors.employments[i]?.address,
        },
        {
          label: "Reason for Leaving",
          name: "reason",
          type: "text",
          value: emp[i].reason,
          error: errors.employments[i]?.reason,
        },
      ];
    },
    [errors, formData]
  );

  const configureCtcData = useCallback(
    (formData, errors) => {
      return [
        ...(formData.nationality === "USA"
          ? [
              {
                label: "CTC Type",
                name: "ctcType",
                type: "dropDownList",
                value: formData.ctcType,
                error: errors.ctcType,
                options: ctcTypes,
              },
            ]
          : []),
        {
          label: "Expected",
          name: "expectedCtc",
          type: "number",
          value: formData.expectedCtc,
          error: errors.expectedCtc,
          required: true,
        },
        {
          label: "Budget",
          name: "budget",
          type: "number",
          value: formData.budget,
          error: errors.budget,
          required: true,
        },
        {
          label: "Granted",
          name: "grantedCtc",
          type: "number",
          value: formData.grantedCtc,
          error: errors.grantedCtc,
          required: true,
        },
      ];
    },
    [formData, errors]
  );

  const configureBudgetApprovalData = useCallback(
    (formData, errors) => {
      let dropdownValue = formData.budgetStatus;

      // Determine the dropdown value based on the workflow status description
      if (
        workflowStatusDescription === "101" ||
        workflowStatusDescription === "300" ||
        workflowStatusDescription === "301" ||
        workflowStatusDescription === "302" ||
        workflowStatusDescription === "303"
      ) {
        if (formData.budgetComment) {
          dropdownValue = "exceptional_approved";
        } else {
          dropdownValue = "approved";
        }
      } else if (workflowStatusDescription === "200") {
        dropdownValue = "approved";
      } else if (workflowStatusDescription === "201") {
        dropdownValue = "rejected";
      } else if (workflowStatusDescription === "202") {
        dropdownValue = "exceptional_approved";
      } else if (workflowStatusDescription === "203") {
        dropdownValue = "revise";
      }

      const updatedFormData = {
        ...formData,
        budgetStatus: dropdownValue,
      };

      // Determine whether to show the comment field
      const shouldShowComment =
        ["rejected", "exceptional_approved", "revise"].includes(
          dropdownValue
        ) || updatedFormData.budgetComment;

      return [
        {
          label: "Budget Approval",
          name: "budgetStatus",
          type: "dropDownList",
          value: dropdownValue, // Set dropdown value based on the conditions
          options: dropdownOptions,
          error: errors.budgetStatus,
        },
        ...(shouldShowComment
          ? [
              {
                label: "Budget Comment",
                name: "budgetComment",
                type: "textarea",
                value: formData.budgetComment,
                error: errors.budgetComment,
              },
            ]
          : []),
      ];
    },
    [dropdownOptions] // Ensure `dropdownOptions` is stable
  );

  const configureOnboardingInitiationData = useCallback(
    (onBoardData, errors, designationData, formData) => {
      console.log("Initaate onboard", formData.nationality);
      const fields = [
        {
          label: "Designation",
          name: "designation",
          type: "dropDownList",
          value: onBoardData.designation,
          options: designationData.map((designation) => ({
            key: designation.designationCode,
            value: designation.designationDescription,
          })),
          error: errors.designation,
          required: true,
        },
        {
          label: "Blood Group",
          name: "bloodGroup",
          type: "dropDownList",
          value: onBoardData.bloodGroup,
          error: errors.bloodGroup,
          options: bloodGroupData,
          required: true,
        },
        {
          label: "Marital Status",
          name: "maritalStatus",
          type: "dropDownList",
          value: onBoardData.maritalStatus,
          options: maritalStatusData,
          error: errors.maritalStatus,
          required: true,
        },
        {
          label: "Group",
          name: "group",
          type: "dropDownList",
          value: onBoardData.group,
          options: groups.map((group) => ({
            key: group.groupName,
            value: group.description,
          })),
          error: errors.group,
          required: true,
        },
        {
          label: "SubGroup",
          name: "subGroup",
          type: "dropDownList",
          value: onBoardData.subGroup,
          options: subGroups.map((subGroup) => ({
            key: subGroup.subGroupName,
            value: subGroup.subGroupName,
          })),
          error: errors.subGroup,
          required: true,
        },
        {
          label: "Jira ID",
          name: "jiraID",
          type: "text",
          value: onBoardData.jiraID,
          error: errors.jiraID,
          required: true,
        },
      ];

      // Only add the UAN field if nationality is not IND
      if (formData.nationality == "IND" || formData.nationality == null) {
        fields.splice(1, 0, {
          // Insert at index 1
          label: "UAN",
          name: "uan",
          type: "text",
          value: onBoardData.uan,
          error: errors.uan,
          required: true,
        });
      }

      return fields;
    },
    [
      errors,
      designationData,
      bloodGroupData,
      maritalStatusData,
      groups,
      subGroups,
    ]
  );

  const configureManagementApprovalData = useCallback(
    (formData, errors) => {
      // const workflowStatusDescription =
      //   state?.workflowStatusDescription || "Default Status";

      let dropdownValue = formData.managementStatus;

      if (workflowStatusDescription === "300") {
        dropdownValue = "approved";
      } else if (workflowStatusDescription === "301") {
        dropdownValue = "rejected";
      } else if (workflowStatusDescription === "302") {
        dropdownValue = "exceptional_approved";
      } else if (workflowStatusDescription === "303") {
        dropdownValue = "revise";
      }

      const updatedFormData = {
        ...formData,
        budgetStatus: dropdownValue,
      };

      const shouldShowComment =
        ["rejected", "exceptional_approved", "revise"].includes(
          dropdownValue
        ) || formData.managementComment;

      return [
        {
          label: "Management Approval",
          name: "managementStatus",
          type: "dropDownList",
          value: dropdownValue,
          options: dropdownOptions,
          error: errors.managementStatus,
        },
        ...(shouldShowComment
          ? [
              {
                label: "Management Comment",
                name: "managementComment",
                type: "textarea",
                value: formData.managementComment,
                error: errors.budgetComment,
              },
            ]
          : []),
      ];
    },
    [formData, errors]
  );

  const handleEducationChange = (index, event) => {
    const { name, value } = event.target;

    // Create a copy of the educations array from formData
    const newEducations = [...formData.educations];
    newEducations[index] = { ...newEducations[index], [name]: value };

    // Create a deep copy of the errors array from the current state
    const newErrors = [...errors.educations];
    newErrors[index] = {
      ...newErrors[index],
      [name]: value ? "" : `Please provide a valid ${name}`,
    };

    // Update the formData state
    setFormData((prevData) => ({
      ...prevData,
      educations: newEducations,
    }));

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      educations: newErrors,
    }));
  };

  const handleAddEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      educations: [
        ...prevData.educations,
        {
          institute: "",
          state: "",
          university: "",
          country: "",
          degree: "",
          mode: "",
          completedOn: "",
        },
      ],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      educations: [...prevErrors.educations, { ...defaultEducationError }],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      educations: prevData.educations.filter((_, i) => i !== index),
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      educations: prevErrors.educations.filter((_, i) => i !== index),
    }));
  };

  const handleEmploymentChange = (index, event) => {
    const { name, value } = event.target;
    const newEmployments = [...formData.employments];
    newEmployments[index] = { ...newEmployments[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      employments: newEmployments,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors, // Spread the previous state
      employments: prevErrors.employments.map((employment, i) =>
        i === index ? { ...employment, [name]: "" } : employment
      ),
    }));
  };

  const handleAddEmployment = () => {
    setFormData((prevData) => ({
      ...prevData,
      employments: [
        ...prevData.employments,
        {
          employer: "",
          empFrom: "",
          empTo: "",
          ctc: "",
          noticePeriod: "",
          address: "",
          reason: "",
        },
      ],
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      employments: [...prevErrors.employments, defaultEmploymentError],
    }));
  };

  const handleRemoveEmployment = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      employments: prevData.employments.filter((_, i) => i !== index),
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      employments: prevErrors.employments.filter((_, i) => i !== index),
    }));
  };

  const fetchCandidateData = useCallback(
    async (isSaved) => {
      try {
        if (candidateId) {
          const candidateData = await getCandidateById(candidateId);
          console.log(candidateData);
          console.log(candidateData);

          setWorkflowStatusDescription(candidateData.workflowStatus);

          console.log("Status is ", candidateData.workflowStatus);

          // Handle file URL and file data
          let filePath = null; // Declare a variable for filePath
          if (candidateData.offers.length > 0) {
            const lastOffer =
              candidateData.offers[candidateData.offers.length - 1];

            if (workflowStatusDescription === "303") {
              setFileUrl(null);
              setFile({ name: "" });
              console.warn(
                "File path or file data is not available due to 303 status."
              );
            } else if (lastOffer.filePath) {
              filePath = lastOffer.filePath; // Assign to the variable
              setFileUrl(filePath);
              setFile({ name: lastOffer.fileName });
              console.log("File path set:", filePath);
            }
          } else {
            setFileUrl(null);
            setFile({ name: "" });
            console.warn("No offers available.");
          }
          const showPassport = !!candidateData.passportNumber;
          const showVisa = !!candidateData.visa;

          setFormData((prevData) => ({
            ...prevData,
            ...candidateData,
            showPassport,
            showVisa,
            initiateOnboard: false,
            offerLetter: candidateData.offerLetter || "",
          }));

          // Set addresses
          const currentAddress = candidateData.addresses?.find(
            (address) => address.type === "Current"
          ) || { line1: "", postalCode: 0, city: "", state: "", country: "" };

          const permanentAddress = candidateData.addresses?.find(
            (address) => address.type === "Permanent"
          ) || { line1: "", postalCode: 0, city: "", state: "", country: "" };

          setCurrentAddress(currentAddress);
          setPermanentAddress(permanentAddress);

          console.log("Inside fetchCandidate", filePath);

          if (!isSaved) {
            Toaster("success", "Candidate data fetched successfully!");
          }

          return filePath; // Return the filePath for use in handleSendOfferLetter
        }
      } catch (error) {
        console.error("Failed to fetch candidate data", error);
        Toaster("error", "Failed to fetch candidate data. Please try again.");
      }
    },
    [candidateId]
  );

  useEffect(() => {
    if (candidateId) {
      fetchCandidateData(false)
        .then(() => {
          // After data is fetched and workflowStatusDescription is updated, update tabStatus
          updateTabStatus();
        })
        .catch();
    } else {
      resetForm(); // Reset form if candidateId is not present
    }
  }, [candidateId, workflowStatusDescription]); // Depend on candidateId and workflowStatusDescription

  const updateTabStatus = () => {
    if (
      workflowStatusDescription === "Default Status" ||
      workflowStatusDescription === "10"
    ) {
      // If workflowStatusDescription is empty, disable tabs except basicInfo
      setTabStatus({
        basicInfo: true,
        education: false,
        employment: false,
        ctcDetails: false,
      });
    } else {
      // If workflowStatusDescription has any value, enable all tabs
      setTabStatus({
        basicInfo: true,
        education: true,
        employment: true,
        ctcDetails: true,
      });
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setWorkflowStatusDescription("Default Status");
    setTabStatus({
      basicInfo: true,
      education: false,
      employment: false,
      ctcDetails: false,
    });
    setCurrentAddress({
      line1: "",
      postalCode: 0,
      city: "",
      state: "",
      country: "",
    });
    setPermanentAddress({
      line1: "",
      postalCode: 0,
      city: "",
      state: "",
      country: "",
    });
    setFileUrl(null);
    setFile({ name: "" });
    setErrors({
      educations: [defaultEducationError],
      employments: [defaultEmploymentError],
    });
  };

  const handleBlur = (event, addressType) => {
    const { name } = event.target;
    console.log(event.target);
    console.log(addressType);

    if (currentTab === 0) {
      validateBasicInfo(name);
      validateAddress(name, addressType);
    }
    if (currentTab === 1) {
      validateEducation(name);
    }
    if (currentTab === 2) {
      validateEmployment(name);
    }
    if (currentTab === 3) {
      validateCtcDetails(name);
    }
  };

  const validateBasicInfo = (fieldName) => {
    let tempErrors = { ...errors }; // Create a copy of the current errors object
    let isValid = true; // Assume the form is valid initially

    switch (fieldName) {
      case "requirementId":
        if (!stringNotNullValidation(formData.requirementId)) {
          tempErrors.requirementId = "Requirement ID is required";
          Toaster("error", tempErrors.requirementId);
          isValid = false;
        } else {
          tempErrors.requirementId = ""; // Clear error if valid
        }
        break;

       case "requirementDesc":
        if (!stringNotNullValidation(formData.requirementDesc)) {
          tempErrors.requirementDesc = "Requirement ID is required";
          Toaster("error", tempErrors.requirementDesc);
          isValid = false;
        } else {
          tempErrors.requirementDesc = ""; // Clear error if valid
        }
        break;

      case "workLocation":
        if (!stringNotNullValidation(formData.workLocation)) {
          tempErrors.workLocation = "Please select a Work Location";
          Toaster("error", tempErrors.workLocation);
          isValid = false;
        } else {
          tempErrors.workLocation = "";
        }
        break;

      case "priority":
        if (!stringNotNullValidation(formData.priority)) {
          tempErrors.priority = "Please select Priority";
          Toaster("error", tempErrors.priority);
          isValid = false;
        } else {
          tempErrors.priority = "";
        }
        break;

      case "doj":
        if (!stringNotNullValidation(formData.doj)) {
          tempErrors.doj = "Date of Joining is required";
          Toaster("error", tempErrors.doj);
          isValid = false;
        } else if (!validateDayjsDate(formData.dob)) {
          tempErrors.doj = "DOJ is not a valid date";
          Toaster("error", tempErrors.doj);
          isValid = false;
        } else {
          tempErrors.doj = "";
        }
        break;

      case "firstName":
        if (!validateAlphabets(formData.firstName)) {
          tempErrors.firstName = "First name is required";
          Toaster("error", tempErrors.firstName);
          isValid = false;
        } else {
          tempErrors.firstName = "";
        }
        break;

      case "lastName":
        if (!stringNotNullValidation(formData.lastName)) {
          tempErrors.lastName = "Last name is required";
          Toaster("error", tempErrors.lastName);
          isValid = false;
        } else if (!validateAlphabets(formData.lastName)) {
          tempErrors.lastName = "Last name should contain only alphabets";
          Toaster("error", tempErrors.lastName);
          isValid = false;
        } else {
          tempErrors.lastName = "";
        }
        break;

      case "primarySkill":
        if (!stringNotNullValidation(formData.primarySkill)) {
          tempErrors.primarySkill = "Primary Skill is required";
          Toaster("error", tempErrors.primarySkill);
          isValid = false;
        } else if (!validateAlphabets(formData.primarySkill)) {
          tempErrors.primarySkill =
            "Primary Skill should contain only alphabets";
          Toaster("error", tempErrors.primarySkill);
          isValid = false;
        } else {
          tempErrors.primarySkill = "";
        }
        break;

      case "dob":
        if (!stringNotNullValidation(formData.dob)) {
          tempErrors.dob = "DOB is required";
          Toaster("error", tempErrors.dob);
          isValid = false;
        } else if (!validateDayjsDate(formData.dob)) {
          tempErrors.dob = "DOB is not a valid date";
          Toaster("error", tempErrors.dob);
          isValid = false;
        } else {
          tempErrors.dob = "";
        }
        break;

      case "gender":
        if (!stringNotNullValidation(formData.gender)) {
          tempErrors.gender = "Please select a gender";
          Toaster("error", tempErrors.gender);
          isValid = false;
        } else {
          tempErrors.gender = "";
        }
        break;

      case "employmentType":
        if (!stringNotNullValidation(formData.employmentType)) {
          tempErrors.employmentType = "Please select an Employment Type";
          Toaster("error", tempErrors.employmentType);
          isValid = false;
        } else {
          tempErrors.employmentType = "";
        }
        break;

      case "vendorName":
        if (!stringNotNullValidation(formData.vendorName)) {
          tempErrors.vendorName = "Vendor Name is required";
          Toaster("error", tempErrors.vendorName);
          isValid = false;
        } else {
          tempErrors.vendorName = "";
        }
        break;

      case "emailAddres":
        if (!stringNotNullValidation(formData.emailAddres)) {
          tempErrors.emailAddres = "Email Address is required";
          Toaster("error", tempErrors.emailAddres);
          isValid = false;
        } else if (!validateEmail(formData.emailAddres)) {
          tempErrors.emailAddres = "Enter a valid email address";
          Toaster("error", tempErrors.emailAddres);
          isValid = false;
        } else {
          tempErrors.emailAddres = "";
        }
        break;

      case "primaryMobileNo":
        if (!stringNotNullValidation(formData.primaryMobileNo)) {
          tempErrors.primaryMobileNo = "Primary Mobile Number is required";
          Toaster("error", tempErrors.primaryMobileNo);
          isValid = false;
        } else if (!validatePhoneNumber(formData.primaryMobileNo)) {
          tempErrors.primaryMobileNo = "Enter a valid phone number";
          Toaster("error", tempErrors.primaryMobileNo);
          isValid = false;
        } else {
          tempErrors.primaryMobileNo = "";
        }
        break;

      case "alternateMobileNo":
        if (
          formData.alternateMobileNo &&
          !validatePhoneNumber(formData.alternateMobileNo)
        ) {
          tempErrors.alternateMobileNo = "Enter a valid phone number";
          Toaster("error", tempErrors.alternateMobileNo);
          isValid = false;
        } else {
          tempErrors.alternateMobileNo = "";
        }
        break;

      case "emergencyMobileNo":
        if (!validatePhoneNumber(formData.emergencyMobileNo)) {
          tempErrors.emergencyMobileNo = "Enter a valid phone number";
          Toaster("error", tempErrors.emergencyMobileNo);
          isValid = false;
        } else {
          tempErrors.emergencyMobileNo = "";
        }
        break;

      case "panId":
        if (formData.nationality === "IND") {
          if (!stringNotNullValidation(formData.panId)) {
            tempErrors.panId = "PAN ID is required";
            Toaster("error", tempErrors.panId);
            isValid = false;
          } else if (!validatePan(formData.panId)) {
            tempErrors.panId = "Enter valid PAN ID";
            Toaster("error", tempErrors.panId);
            isValid = false;
          } else {
            tempErrors.panId = "";
          }
        }
        break;

      case "aadhaarNo":
        if (formData.nationality === "IND") {
          if (
            formData.aadhaarNo &&
            !stringNotNullValidation(formData.aadhaarNo)
          ) {
            tempErrors.aadhaarNo = "Aadhaar number is required";
            Toaster("error", tempErrors.aadhaarNo);
            isValid = false;
          } else if (
            formData.aadhaarNo &&
            !validateAadhaar(formData.aadhaarNo)
          ) {
            tempErrors.aadhaarNo = "Enter valid Aadhaar number ID";
            Toaster("error", tempErrors.aadhaarNo);
            isValid = false;
          } else {
            tempErrors.aadhaarNo = ""; // Clear error if valid or empty
          }
        }
        break;

      case "passportNumber":
        if (formData.showPassport) {
          if (!stringNotNullValidation(formData.passportNumber)) {
            tempErrors.passportNumber = "Passport number is required";
            Toaster("error", tempErrors.passportNumber);
            isValid = false;
          } else {
            tempErrors.passportNumber = "";
          }
        }
        break;

      case "expiry":
        if (formData.showPassport) {
          if (!stringNotNullValidation(formData.expiry)) {
            tempErrors.expiry = "Expiry date is required";
            Toaster("error", tempErrors.expiry);
            isValid = false;
          } else if (!validateDayjsDate(formData.expiry)) {
            tempErrors.expiry = "Expiry date is not valid";
            Toaster("error", tempErrors.expiry);
            isValid = false;
          } else {
            tempErrors.expiry = "";
          }
        }
        break;

      case "visa":
        if (formData.showVisa) {
          if (!stringNotNullValidation(formData.visa)) {
            tempErrors.visa = "Visa type is required";
            Toaster("error", tempErrors.visa);
            isValid = false;
          } else {
            tempErrors.visa = "";
          }
        }
        break;

      case "visaCountry":
        if (formData.showVisa) {
          if (!stringNotNullValidation(formData.visaCountry)) {
            tempErrors.visaCountry = "Visa country is required";
            Toaster("error", tempErrors.visaCountry);
            isValid = false;
          } else {
            tempErrors.visaCountry = "";
          }
        }
        break;

      case "visaExpiry":
        if (formData.showVisa) {
          if (!stringNotNullValidation(formData.visaExpiry)) {
            tempErrors.visaExpiry = "Visa expiry date is required";
            Toaster("error", tempErrors.visaExpiry);
            isValid = false;
          } else if (!validateDayjsDate(formData.visaExpiry)) {
            tempErrors.visaExpiry = "Visa expiry date is not valid";
            Toaster("error", tempErrors.visaExpiry);
            isValid = false;
          } else {
            tempErrors.visaExpiry = "";
          }
        }
        break;

      default:
        break;
    }
    console.log(tempErrors);
    setErrors((prev) => ({ ...prev, ...tempErrors })); // Update the state with the errors
    return isValid; // Return the validity of the form
  };

  const validateAddress = (fieldName, addressType) => {
    let tempErrors = { ...errors }; // Create a copy of the current errors object
    let isValid = true; // Assume the form is valid initially

    // Determine which address to use (currentAddress or permanentAddress)
    const address =
      addressType === "currentAddress" ? currentAddress : permanentAddress;

    switch (fieldName) {
      // Address Fields Validation
      case "line1":
        if (!stringNotNullValidation(address.line1)) {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            line1: "Address Line 1 is required",
          };
          Toaster("error", tempErrors[addressType].line1);
          isValid = false;
        } else {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            line1: "", // Clear error if valid
          };
        }
        break;

      case "country":
        if (!validateAlphabets(address.country)) {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            country: "Country should contain only alphabets",
          };
          Toaster("error", tempErrors[addressType].country);
          isValid = false;
        } else {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            country: "", // Clear error if valid
          };
        }
        break;

      case "city":
        if (!validateAlphabets(address.city)) {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            city: "City should contain only alphabets",
          };
          Toaster("error", tempErrors[addressType].city);
          isValid = false;
        } else {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            city: "", // Clear error if valid
          };
        }
        break;

      case "state":
        if (!validateAlphabets(address.state)) {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            state: "State should contain only alphabets",
          };
          Toaster("error", tempErrors[addressType].state);
          isValid = false;
        } else {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            state: "", // Clear error if valid
          };
        }
        break;

      case "postalCode":
        if (!validatePostalCode(address.postalCode)) {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            postalCode: "Postal Code is invalid",
          };
          Toaster("error", tempErrors[addressType].postalCode);
          isValid = false;
        } else {
          tempErrors[addressType] = {
            ...tempErrors[addressType], // Preserve existing errors for the address type
            postalCode: "", // Clear error if valid
          };
        }
        break;

      default:
        break;
    }

    console.log("Updated tempErrors:", tempErrors);
    setErrors((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType], // Preserve the existing errors for the address type
        ...tempErrors[addressType], // Update the current address type with the latest errors
      },
    }));

    return isValid; // Return the validity of the form
  };

  const validateEducation = (fieldName) => {
    let tempErrors = { ...errors }; // Create a copy of the current errors object
    let isValid = true; // Assume the form is valid initially

    for (const [index, education] of formData.educations.entries()) {
      switch (fieldName) {
        case "institute":
          if (!stringNotNullValidation(education?.institute)) {
            tempErrors.educations[index].institute = "Institute is required";
            Toaster("error", tempErrors.educations[index].institute);
            isValid = false;
          } else {
            tempErrors.educations[index].institute = ""; // Clear error if valid
          }
          break;

        case "university":
          if (!validateAlphabets(education?.university)) {
            tempErrors.educations[index].university =
              "University should contain only alphabets";
            Toaster("error", tempErrors.educations[index].university);
            isValid = false;
          } else {
            tempErrors.educations[index].university = ""; // Clear error if valid
          }
          break;

        case "degree":
          if (!stringNotNullValidation(education?.degree)) {
            tempErrors.educations[index].degree = "Degree is required";
            Toaster("error", tempErrors.educations[index].degree);
            isValid = false;
          } else {
            tempErrors.educations[index].degree = ""; // Clear error if valid
          }
          break;

        case "eduState":
          if (!validateAlphabets(education?.eduState)) {
            tempErrors.educations[index].eduState =
              "State should contain only alphabets";
            Toaster("error", tempErrors.educations[index].eduState);
            isValid = false;
          } else {
            tempErrors.educations[index].eduState = ""; // Clear error if valid
          }
          break;

        case "eduCountry":
          if (!validateAlphabets(education?.eduCountry)) {
            tempErrors.educations[index].eduCountry =
              "Country should contain only alphabets";
            Toaster("error", tempErrors.educations[index].eduCountry);
            isValid = false;
          } else {
            tempErrors.educations[index].eduCountry = ""; // Clear error if valid
          }
          break;

        case "completedOn":
          if (!validateDayjsDate(education?.completedOn)) {
            tempErrors.educations[index].completedOn =
              "Completion date is invalid";
            Toaster("error", tempErrors.educations[index].completedOn);
            isValid = false;
          } else {
            tempErrors.educations[index].completedOn = ""; // Clear error if valid
          }
          break;

        case "mode":
          if (!stringNotNullValidation(education?.mode)) {
            tempErrors.educations[index].mode = "Mode of study is required";
            Toaster("error", tempErrors.educations[index].mode);
            isValid = false;
          } else {
            tempErrors.educations[index].mode = ""; // Clear error if valid
          }
          break;

        case "gradeMarks":
          if (!stringNotNullValidation(education?.gradeMarks)) {
            tempErrors.educations[index].gradeMarks = "Grade is required";
            Toaster("error", tempErrors.educations[index].gradeMarks);
            isValid = false;
          } else {
            tempErrors.educations[index].gradeMarks = ""; // Clear error if valid
          }
          break;

        default:
          break;
      }
    }

    setErrors(tempErrors); // Update state with the latest errors
    return isValid; // Return the validity of the form
  };

  const validateEmployment = (fieldName) => {
    let tempErrors = { ...errors }; // Create a copy of the current errors object
    let isValid = true; // Assume the form is valid initially
    console.log("Validation", fieldName);

    for (const [index, employment] of formData.employments.entries()) {
      switch (fieldName) {
        case "employer":
          if (!stringNotNullValidation(employment.employer)) {
            tempErrors.employments[index].employer = "Employer is required";
            Toaster("error", tempErrors.employments[index].employer);
            isValid = false;
          } else {
            tempErrors.employments[index].employer = ""; // Clear error if valid
          }
          break;
        case "empFrom":
          if (!validateDayjsDate(employment.empFrom)) {
            tempErrors.employments[index].empFrom = "Start date is required";
            Toaster("error", tempErrors.employments[index].empFrom);
            isValid = false;
          } else {
            tempErrors.employments[index].empFrom = ""; // Clear error if valid
          }
          break;
        case "empTo":
          // Check if index is 0, if so, skip the validation
          if (index !== 0) {
            if (!validateDayjsDate(employment.empTo)) {
              tempErrors.employments[index].empTo = "End date is required";
              Toaster("error", tempErrors.employments[index].empTo);
              isValid = false;
            } else {
              tempErrors.employments[index].empTo = ""; // Clear error if valid
            }
          }
          break;
        case "ctc":
          if (!stringNotNullValidation(employment.ctc)) {
            tempErrors.employments[index].ctc = "CTC is required";
            Toaster("error", tempErrors.employments[index].ctc);
            isValid = false;
          } else {
            tempErrors.employments[index].ctc = ""; // Clear error if valid
          }
          break;
        case "noticePeriod":
          if (index === 0) {
            if (!stringNotNullValidation(employment.noticePeriod)) {
              tempErrors.employments[index].noticePeriod =
                "Notice Period is required";
              Toaster("error", tempErrors.employments[index].noticePeriod);
              isValid = false;
            } else {
              tempErrors.employments[index].noticePeriod = ""; // Clear error if valid
            }
          }
          break;
        case "address":
          if (!stringNotNullValidation(employment.address)) {
            tempErrors.employments[index].address = "Address is required";
            Toaster("error", tempErrors.employments[index].address);
            isValid = false;
          } else {
            tempErrors.employments[index].address = ""; // Clear error if valid
          }
          break;
        case "reason":
          if (!stringNotNullValidation(employment.reason)) {
            tempErrors.employments[index].reason =
              "Reason for leaving is required";
            Toaster("error", tempErrors.employments[index].reason);
            isValid = false;
          } else {
            tempErrors.employments[index].reason = ""; // Clear error if valid
          }
          break;
        default:
          break;
      }
    }
    setErrors(tempErrors); // Update state with the latest errors
    return isValid; // Return the validity of the form
  };

  const validateCtcDetails = (fieldName) => {
    let tempErrors = { ...errors }; // Create a copy of the current errors object
    let isValid = true;

    switch (fieldName) {
      case "ctcType":
        if (formData.nationality !== "IND") {
          if (!stringNotNullValidation(formData.ctcType)) {
            tempErrors.ctcType = "Please select a CTC Type";
            Toaster("error", tempErrors.ctcType);
            isValid = false;
          } else {
            tempErrors.ctcType = ""; // Clear error if valid
          }
        }
        break;
      case "expectedCtc":
        if (!integerNotNullValidation(formData.expectedCtc)) {
          tempErrors.expectedCtc = "Expected CTC is required";
          Toaster("error", tempErrors.expectedCtc);
          isValid = false;
        } else {
          tempErrors.expectedCtc = ""; // Clear error if valid
        }
        break;
      case "budget":
        if (!integerNotNullValidation(formData.budget)) {
          tempErrors.budget = "Budget is required";
          Toaster("error", tempErrors.budget);
          isValid = false;
        } else {
          tempErrors.budget = ""; // Clear error if valid
        }
        break;
      case "grantedCtc":
        if (!integerNotNullValidation(formData.grantedCtc)) {
          tempErrors.grantedCtc = "Granted CTC is required";
          Toaster("error", tempErrors.grantedCtc);
          isValid = false;
        } else {
          tempErrors.grantedCtc = ""; // Clear error if valid
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, ...tempErrors })); // Update state with the latest errors
    return isValid; // Return the validity of the form
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    console.log(name, value, checked, type); // Debugging log

    // Handle checkboxes for showPassport and showVisa
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked, // Update showPassport or showVisa
      }));

      // Handle sameAsPermanent checkbox
      if (name === "sameAsPermanent") {
        setFormData((prevData) => {
          const updatedData = {
            ...prevData,
            sameAsPermanent: checked,
          };
          setCurrentAddress((prev) =>
            checked ? { ...permanentAddress, id: prev.id } : {}
          ); // Update currentAddress
          return updatedData;
        });
      }
    }
    // Handle nationality selection
    else if (name === "nationality") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      fetchDocumentByCode(value);
    }
    // Handle other input changes
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Update errors based on input validation
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  };

  // Synchronize currentAddress with permanentAddress if sameAsPermanent is true
  useEffect(() => {
    if (formData.sameAsPermanent) {
      setCurrentAddress((prev) => ({ ...permanentAddress, id: prev.id }));
    }
  }, [formData.sameAsPermanent, permanentAddress]);

  // Handle Permanent Address Change
  const handlePermanentAddressChange = (event) => {
    const { name, value } = event.target;

    if (name === "postalCode" && value.length >= 5) {
      fetchDetailsByPincode(value, "permanentAddress");
    }

    setPermanentAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Current Address Change
  const handleCurrentAddressChange = (event) => {
    const { name, value } = event.target;

    if (name === "currentPostalCode" && value.length >= 5) {
      fetchDetailsByPincode(value, "currentAddress");
    }

    setCurrentAddress((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update formData when permanentAddress changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: [
        {
          ...prevData.addresses.find((address) => address.type === "Current"),
          type: "Current",
        },
        {
          ...permanentAddress,
          type: "Permanent",
        },
      ],
    }));
  }, [permanentAddress]);

  // Update formData when currentAddress changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: [
        {
          ...currentAddress,
          type: "Current",
        },
        {
          ...prevData.addresses.find((address) => address.type === "Permanent"),
          type: "Permanent",
        },
      ],
    }));
  }, [currentAddress]);

  const handleApprovalChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  };

  const handleOnboardChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    // Update the onBoardData state
    setOnBoardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "group") {
      // Update the selectedGroup based on group name
      const selectedGroup = groups.find((group) => group.groupName === value);

      // Update state with the selected group
      setSelectedGroup({
        id: selectedGroup ? selectedGroup.groupId : null,
        name: value,
      });

      // Reset the subgroup selection
      setSelectedSubGroup(null);

      // Set subGroups based on the selected group
      setSubGroups(selectedGroup ? selectedGroup.subGroupDetails : []);
    } else if (name === "subGroup") {
      // Update the selectedSubGroup based on subgroup name
      const selectedSubGroup = subGroups.find(
        (subGroup) => subGroup.subGroupName === value
      );

      // Update state with the selected subgroup
      setSelectedSubGroup({
        id: selectedSubGroup ? selectedSubGroup.subGroupId : null,
        name: value,
      });
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  };

  const validate = (event, type) => {
    console.log(formData);

    let tempErrors = { ...errors };
    let isValid = true;

    const validateField = (fieldName) => {
      switch (fieldName) {
        case "requirementId":
          if (!stringNotNullValidation(formData.requirementId)) {
            tempErrors.requirementId = "Requirement ID is required";
            Toaster("error", tempErrors.requirementId);
            isValid = false;
          } else {
            tempErrors.requirementId = ""; // Clear error if valid
          }
          break;
        case "requirementDesc":
        if (!stringNotNullValidation(formData.requirementDesc)) {
          tempErrors.requirementDesc = "Requirement Description is required";
          Toaster("error", tempErrors.requirementDesc);
          isValid = false;
        } else {
          tempErrors.requirementDesc = ""; // Clear error if valid
        }
        break;

        case "workLocation":
          if (!stringNotNullValidation(formData.workLocation)) {
            tempErrors.workLocation = "Please select a Work Location";
            Toaster("error", tempErrors.workLocation);
            isValid = false;
          } else {
            tempErrors.workLocation = "";
          }
          break;
        case "firstName":
          if (!validateAlphabets(formData.firstName)) {
            tempErrors.firstName = "First name is required";
            Toaster("error", tempErrors.firstName);
            isValid = false;
          } else {
            tempErrors.firstName = "";
          }
          break;
        case "lastName":
          if (!validateAlphabets(formData.lastName)) {
            tempErrors.lastName = "Last name is required";
            Toaster("error", tempErrors.lastName);
            isValid = false;
          } else {
            tempErrors.lastName = "";
          }
          break;
        case "primarySkill":
          if (!validateAlphabets(formData.primarySkill)) {
            tempErrors.primarySkill = "Primary Skill is required";
            Toaster("error", tempErrors.primarySkill);
            isValid = false;
          } else {
            tempErrors.primarySkill = "";
          }
          break;
        case "dob":
          if (!validateDayjsDate(formData.dob)) {
            tempErrors.dob = "DOB is required";
            Toaster("error", tempErrors.dob);
            isValid = false;
          } else {
            tempErrors.dob = "";
          }
          break;
        case "gender":
          if (!stringNotNullValidation(formData.gender)) {
            tempErrors.gender = "Please select a gender";
            Toaster("error", tempErrors.gender);
            isValid = false;
          } else {
            tempErrors.gender = "";
          }
          break;
        case "employmentType":
          if (!stringNotNullValidation(formData.employmentType)) {
            tempErrors.employmentType = "Please select an Employment Type";
            Toaster("error", tempErrors.employmentType);
            isValid = false;
          } else {
            tempErrors.employmentType = "";
          }
          break;
        case "emailAddres":
          if (!validateEmail(formData.emailAddres)) {
            tempErrors.emailAddres = "Enter a valid email address";
            Toaster("error", tempErrors.emailAddres);
            isValid = false;
          } else {
            tempErrors.emailAddres = "";
          }
          break;

        case "primaryMobileNo":
          if (!validatePhoneNumber(formData.primaryMobileNo)) {
            tempErrors.primaryMobileNo = "Enter valid phone number";
            Toaster("error", tempErrors.primaryMobileNo);
            isValid = false;
          } else {
            tempErrors.primaryMobileNo = "";
          }
          break;
        case "panId":
          if (formData.nationality === "IND") {
            if (!validatePan(formData.panId)) {
              tempErrors.panId = "Enter valid PAN ID";
              Toaster("error", tempErrors.panId);
              isValid = false;
            } else {
              tempErrors.panId = "";
            }
          }
          break;

        case "aadhaarNo":
          if (formData.nationality === "IND") {
            if (formData.aadhaarNo && !validateAadhaar(formData.aadhaarNo)) {
              tempErrors.aadhaarNo = "Enter valid Aadhaar number ID";
              Toaster("error", tempErrors.aadhaarNo);
              isValid = false;
            } else {
              tempErrors.aadhaarNo = ""; // Clear error if valid or empty
            }
          }
          break;
        case "passportNumber":
          if (formData.showPassport) {
            if (!stringNotNullValidation(formData.passportNumber)) {
              tempErrors.passportNumber = "Enter valid passport number";
              Toaster("error", tempErrors.passportNumber);
              isValid = false;
            } else {
              tempErrors.passportNumber = "";
            }
          }
          break;
        case "expiry":
          if (formData.showPassport) {
            if (!validateDayjsDate(formData.expiry)) {
              tempErrors.expiry = "Expiry date is required";
              Toaster("error", tempErrors.expiry);
              isValid = false;
            } else {
              tempErrors.expiry = "";
            }
          }
          break;
        case "visa":
          if (formData.showVisa) {
            if (!stringNotNullValidation(formData.visa)) {
              tempErrors.visa = "Please select a Visa Type";
              Toaster("error", tempErrors.visa);
              isValid = false;
            } else {
              tempErrors.visa = "";
            }
          }
          break;
        case "visaCountry":
          if (formData.showVisa) {
            if (!stringNotNullValidation(formData.visaCountry)) {
              tempErrors.visaCountry = "Please select a Visa Country";
              Toaster("error", tempErrors.visaCountry);
              isValid = false;
            } else {
              tempErrors.visaCountry = "";
            }
          }
          break;
        case "visaExpiry":
          if (formData.showVisa) {
            if (!validateDayjsDate(formData.visaExpiry)) {
              tempErrors.visaExpiry = "Visa Expiry Date is required";
              Toaster("error", tempErrors.visaExpiry);
              isValid = false;
            } else {
              tempErrors.visaExpiry = "";
            }
          }
          break;
        case "ctcType":
          if (formData.nationality !== "IND") {
            if (!stringNotNullValidation(formData.ctcType)) {
              tempErrors.ctcType = "Please select a CTC Type";
              Toaster("error", tempErrors.ctcType);
              isValid = false;
            } else {
              tempErrors.ctcType = "";
            }
          }
          break;
        case "expectedCtc":
          if (!integerNotNullValidation(formData.expectedCtc)) {
            tempErrors.expectedCtc = "Expected CTC is required";
            Toaster("error", tempErrors.expectedCtc);
            isValid = false;
          } else {
            tempErrors.expectedCtc = "";
          }
          break;
        case "budget":
          if (!integerNotNullValidation(formData.budget)) {
            tempErrors.budget = "Budget is required";
            Toaster("error", tempErrors.budget);
            isValid = false;
          } else {
            tempErrors.budget = "";
          }
          break;
        case "grantedCtc":
          if (!integerNotNullValidation(formData.grantedCtc)) {
            tempErrors.grantedCtc = "Granted CTC is required";
            Toaster("error", tempErrors.grantedCtc);
            isValid = false;
          } else {
            tempErrors.grantedCtc = "";
          }
          break;
        default:
          break;
      }
    };

    const validateEducation = (fieldName) => {
      console.log("Validation", fieldName);
      for (const [index, education] of formData.educations.entries()) {
        switch (fieldName) {
          case "institute":
            if (!stringNotNullValidation(education?.institute)) {
              tempErrors.educations[index].institute =
                "Institute ID is required";
              Toaster("error", tempErrors.educations[index].institute);
              isValid = false;
            } else {
              tempErrors.educations[index].institute = ""; // Clear error if valid
            }
            break;
          case "university":
            if (!stringNotNullValidation(education?.university)) {
              tempErrors.educations[index].university =
                "University ID is required";
              Toaster("error", tempErrors.educations[index].university);
              isValid = false;
            } else {
              tempErrors.educations[index].university = ""; // Clear error if valid
            }
            break;
          case "degree":
            if (!stringNotNullValidation(education?.degree)) {
              tempErrors.educations[index].degree = "Degree is required";
              Toaster("error", tempErrors.educations[index].degree);
              isValid = false;
            } else {
              tempErrors.educations[index].degree = ""; // Clear error if valid
            }
            break;
          case "eduState":
            if (!stringNotNullValidation(education?.eduState)) {
              tempErrors.educations[index].eduState = "State is required";
              Toaster("error", tempErrors.educations[index].eduState);
              isValid = false;
            } else {
              tempErrors.educations[index].eduState = ""; // Clear error if valid
            }
            break;
          case "eduCountry":
            if (!stringNotNullValidation(education?.eduCountry)) {
              tempErrors.educations[index].eduCountry = "Country is required";
              Toaster("error", tempErrors.educations[index].eduCountry);
              isValid = false;
            } else {
              tempErrors.educations[index].eduCountry = ""; // Clear error if valid
            }
            break;
          case "completedOn":
            if (!validateDayjsDate(education?.completedOn)) {
              tempErrors.educations[index].completedOn =
                "Completion date is required";
              Toaster("error", tempErrors.educations[index].completedOn);
              isValid = false;
            } else {
              tempErrors.educations[index].completedOn = ""; // Clear error if valid
            }
            break;
          case "mode":
            if (!stringNotNullValidation(education?.mode)) {
              tempErrors.educations[index].mode = "Mode of study is required";
              Toaster("error", tempErrors.educations[index].mode);
              isValid = false;
            } else {
              tempErrors.educations[index].mode = ""; // Clear error if valid
            }
            break;
          case "gradeMarks":
            if (!stringNotNullValidation(education?.gradeMarks)) {
              tempErrors.educations[index].gradeMarks = "Grade is required";
              Toaster("error", tempErrors.educations[index].gradeMarks);
              isValid = false;
            } else {
              tempErrors.educations[index].gradeMarks = ""; // Clear error if valid
            }
            break;
          default:
            break;
        }
      }
    };
    const validateEmployment = (fieldName) => {
      console.log("Validation", fieldName);
      for (const [index, employment] of formData.employments.entries()) {
        switch (fieldName) {
          case "employer":
            if (!stringNotNullValidation(employment.employer)) {
              tempErrors.employments[index].employer = "Employer is required";
              Toaster("error", tempErrors.employments[index].employer);
              isValid = false;
            } else {
              tempErrors.employments[index].employer = ""; // Clear error if valid
            }
            break;
          case "empFrom":
            if (!validateDayjsDate(employment.empFrom)) {
              tempErrors.employments[index].empFrom = "Start date is required";
              Toaster("error", tempErrors.employments[index].empFrom);
              isValid = false;
            } else {
              tempErrors.employments[index].empFrom = ""; // Clear error if valid
            }
            break;
          case "empTo":
            if (!validateDayjsDate(employment.empTo)) {
              tempErrors.employments[index].empTo = "End date is required";
              Toaster("error", tempErrors.employments[index].empTo);
              isValid = false;
            } else {
              tempErrors.employments[index].empTo = ""; // Clear error if valid
            }
            break;
          // case "ctc":
          //   if (employment.ctc == null || employment.ctc === "") {
          //     tempErrors.employments[index].ctc = "CTC is required";
          //     Toaster("error", tempErrors.employments[index].ctc);
          //     isValid = false;
          //   } else {
          //     tempErrors.employments[index].ctc = ""; // Clear error if valid
          //   }
          //   break;
          case "noticePeriod":
            if (index === 0) {
              if (
                employment.noticePeriod == null ||
                employment.noticePeriod === ""
              ) {
                tempErrors.employments[index].noticePeriod =
                  "Notice Period is required";
                Toaster("error", tempErrors.employments[index].noticePeriod);
                isValid = false;
              } else {
                tempErrors.employments[index].noticePeriod = ""; // Clear error if valid
              }
            }
            break;
          case "address":
            if (!stringNotNullValidation(employment.address)) {
              tempErrors.employments[index].address = "Address is required";
              Toaster("error", tempErrors.employments[index].address);
              isValid = false;
            } else {
              tempErrors.employments[index].address = ""; // Clear error if valid
            }
            break;
          case "reason":
            if (!stringNotNullValidation(employment.reason)) {
              tempErrors.employments[index].reason =
                "Reason for leaving is required";
              Toaster("error", tempErrors.employments[index].reason);
              isValid = false;
            } else {
              tempErrors.employments[index].reason = ""; // Clear error if valid
            }
            break;
          default:
            break;
        }
      }
    };

    const validatePermanentAddress = (fieldName) => {
      const permanentAddress = formData.addresses.find(
        (data) => data.type === "Permanent"
      );

      if (!permanentAddress) {
        Toaster("error", "Permanent address not found");
        return false; // or set isValid to false
      }

      switch (fieldName) {
        case "line1":
          if (!stringNotNullValidation(permanentAddress.line1)) {
            tempErrors.line1 = "Address line 1 is required";
            Toaster("error", tempErrors.line1);
            return false;
          } else {
            tempErrors.line1 = ""; // Clear error if valid
          }
          break;

        case "postalCode":
          if (!validatePostalCode(permanentAddress.postalCode)) {
            tempErrors.postalCode = "Postal code is required";
            Toaster("error", tempErrors.postalCode);
            return false;
          } else {
            tempErrors.postalCode = ""; // Clear error if valid
          }
          break;

        case "city":
          if (!validateAlphabets(permanentAddress.city)) {
            tempErrors.city = "City is required";
            Toaster("error", tempErrors.city);
            return false;
          } else {
            tempErrors.city = ""; // Clear error if valid
          }
          break;

        case "state":
          if (!validateAlphabets(permanentAddress.state)) {
            tempErrors.state = "State is required";
            Toaster("error", tempErrors.state);
            return false;
          } else {
            tempErrors.state = ""; // Clear error if valid
          }
          break;

        case "country":
          if (!validateAlphabets(permanentAddress.country)) {
            tempErrors.country = "Country is required";
            Toaster("error", tempErrors.country);
            return false;
          } else {
            tempErrors.country = ""; // Clear error if valid
          }
          break;

        default:
          break;
      }
    };

    const validateCurrentAddress = (fieldName) => {
      const currentAddress = formData.addresses.find(
        (data) => data.type === "Current"
      );

      if (!currentAddress) {
        Toaster("error", "Current address not found");
        return false; // or set isValid to false
      }

      switch (fieldName) {
        case "currentLine1":
          if (!stringNotNullValidation(currentAddress.currentLine1)) {
            tempErrors.currentLine1 = "Current Address line 1 is required";
            Toaster("error", tempErrors.currentLine1);
            return false;
          } else {
            tempErrors.currentLine1 = ""; // Clear error if valid
          }
          break;

        case "currentPostalCode":
          if (!validatePostalCode(currentAddress.currentPostalCode)) {
            tempErrors.currentPostalCode = "Current postal code is required";
            Toaster("error", tempErrors.currentPostalCode);
            return false;
          } else {
            tempErrors.currentPostalCode = ""; // Clear error if valid
          }
          break;

        case "currentCity":
          if (!validateAlphabets(currentAddress.currentCity)) {
            tempErrors.currentCity = "Current city is required";
            Toaster("error", tempErrors.currentCity);
            return false;
          } else {
            tempErrors.currentCity = ""; // Clear error if valid
          }
          break;

        case "currentState":
          if (!validateAlphabets(currentAddress.currentState)) {
            tempErrors.currentState = "Current state is required";
            Toaster("error", tempErrors.currentState);
            return false;
          } else {
            tempErrors.currentState = ""; // Clear error if valid
          }
          break;

        case "currentCountry":
          if (!validateAlphabets(currentAddress.currentCountry)) {
            tempErrors.currentCountry = "Current country is required";
            Toaster("error", tempErrors.currentCountry);
            return false;
          } else {
            tempErrors.currentCountry = ""; // Clear error if valid
          }
          break;

        default:
          break;
      }
    };

    if (type === "blur") {
      const fieldName = event.target.name;
      validateField(fieldName);
      validateEducation(fieldName);
      validateEmployment(fieldName);
      validatePermanentAddress(fieldName);
      validateCurrentAddress(fieldName);
    } else {
      Object.keys(formData).forEach((key) => {
        validateField(key);
      });
      formData.educations.forEach((education, index) => {
        validateEducation("institute", index);
        validateEducation("university", index);
        validateEducation("degree", index);
        validateEducation("eduState", index);
        validateEducation("eduCountry", index);
        validateEducation("completedOn", index);
        validateEducation("mode", index);
        validateEducation("gradeMarks", index);
      });
      formData.employments.forEach((employment, index) => {
        validateEmployment("employer", index);
        validateEmployment("empFrom", index);
        validateEmployment("empTo", index);
        validateEmployment("ctc", index);
        validateEmployment("address", index);
        validateEmployment("reason", index);
        validateEmployment("noticePeriod", index);
      });
      formData.addresses.forEach((permanentAddress, index) => {
        validatePermanentAddress("line1");
        validatePermanentAddress("postalCode");
        validatePermanentAddress("city");
        validatePermanentAddress("state");
        validatePermanentAddress("country");
      });

      formData.addresses.forEach((currentAddress, index) => {
        validateCurrentAddress("currentLine1");
        validateCurrentAddress("currentPostalCode");
        validateCurrentAddress("currentCity");
        validateCurrentAddress("currentState");
        validateCurrentAddress("currentCountry");
      });
    }

    console.log(tempErrors);
    setErrors(tempErrors);
    return isValid;
  };

  // useEffect(() => {
  //   if (isSaved) {
  //     // Fetch candidate data if isSaved is true
  //     fetchCandidateData(true); // Call the method to fetch candidate data after save
  //   }
  // }, [isSaved]);

  const handleSave = () => {
    const fieldsToValidate = [
      "requirementId",
      "requirementDesc",
      "firstName",
      "lastName",
    ];

    let isValid = true;
    let validationErrors = {};

    // Iterate over the fields to validate
    for (const field of fieldsToValidate) {
      // Trigger blur validation and store result
      const validationResult = validate({ target: { name: field } }, "blur");

      if (!validationResult) {
        // If any field fails validation, stop further processing
        validationErrors[field] = `${field} is required`;
        isValid = false;
      }
    }

    // If validation fails, show error with all fields that need attention
    if (!isValid) {
      const missingFields = Object.keys(validationErrors).join(", ");
      Toaster(
        "error",
        `Please fill in the mandatory fields: ${missingFields}.`
      );
      return;
    }
    setIsSaved(true);
    console.log("Candidate saved successfully", formData);
    let req = { ...formData };
    req.dob = formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : "";
    console.log(req.dob);
    createOrUpdateCandidate(req, true)
      .then((response) => {
        console.log("Candidate saved successfully", response);
        console.log("candidate id", response.id);
        const savedCandidateId = response.id;
        setCandidateId(savedCandidateId);
        navigate(`/home/smartHire/candidate/${savedCandidateId}`);
        fetchCandidateData(isSaved);
        // Show success toast for creation
        Toaster("success", "Candidate saved successfully!");
      })
      .catch((error) => {
        console.error("Error creating candidate:", error);
        console.log(error.response.data.detail);
        // Show error toast for creation
        Toaster("error", error.response.data.detail);
      });
  };
  const handleContinue = (event) => {
    let isValid = true; // Assume the form is valid by default

    // Validate based on the current tab
    switch (currentTab) {
      case 0: // Validate Basic Info
        const flatFields = [
          "requirementId",
          "requirementDesc",
          "workLocation",
          "firstName",
          "lastName",
          "primarySkill",
          "dob",
          "gender",
          "employmentType",
          "emailAddres",
          "primaryMobileNo",
          "panId",
          "aadhaarNo",
          "passportNumber",
          "expiry",
          "visa",
          "visaCountry",
          "visaExpiry",
        ];

        flatFields.forEach((field) => {
          if (!validateBasicInfo(field)) {
            // Assuming validateBasicInfo works for all fields
            isValid = false;
            console.log(`${field} is invalid`); // You can replace this with a field error handler or a toast notification
          }
        });

        const addressFields = [
          "line1",
          "country",
          "city",
          "state",
          "postalCode",
        ];

        // Loop through address types and validate address fields
        ["currentAddress", "permanentAddress"].forEach((addressType) => {
          addressFields.forEach((field) => {
            if (!validateAddress(field, addressType)) {
              isValid = false;
              console.log(`${addressType} - ${field} is invalid`);
              // You can replace this with a toast notification or field-specific error handler
            }
          });
        });

        break;

      case 1: // Validate Education
        formData.educations.forEach((education, index) => {
          isValid = validateEducation("institute", index) && isValid;
          isValid = validateEducation("university", index) && isValid;
          isValid = validateEducation("degree", index) && isValid;
          isValid = validateEducation("eduState", index) && isValid;
          isValid = validateEducation("eduCountry", index) && isValid;
          isValid = validateEducation("completedOn", index) && isValid;
          isValid = validateEducation("mode", index) && isValid;
          isValid = validateEducation("gradeMarks", index) && isValid;
        });
        break;

      case 2: // Validate Employment
        formData.employments.forEach((employment, index) => {
          isValid = validateEmployment("employer", index) && isValid;
          isValid = validateEmployment("empFrom", index) && isValid;
          isValid = validateEmployment("empTo", index) && isValid;
          isValid = validateEmployment("noticePeriod", index) && isValid;
          isValid = validateEmployment("address", index) && isValid;
          isValid = validateEmployment("reason", index) && isValid;
        });
        break;
    }

    // If the current tab is valid, proceed to the next tab
    if (isValid) {
      // Enable the next tab after successful validation
      const newTabStatus = { ...tabStatus };

      if (currentTab === 0) {
        newTabStatus.education = true;
      } else if (currentTab === 1) {
        newTabStatus.employment = true;
      } else if (currentTab === 2) {
        newTabStatus.ctcDetails = true;
      }

      setTabStatus(newTabStatus);

      // Move to the next tab if possible
      if (currentTab < 3) {
        setCurrentTab((prevTab) => prevTab + 1);
      }
    } else {
      alert("Please fix the errors before continuing.");
    }
  };

  const handleSubmit = (event) => {
    let isValid = true; // Assume the form is valid by default

    // Validate only CTC details before submission
    isValid = validateCtcDetails("ctcType") && isValid;
    isValid = validateCtcDetails("expectedCtc") && isValid;
    isValid = validateCtcDetails("budget") && isValid;
    isValid = validateCtcDetails("grantedCtc") && isValid;

    // If the CTC details are valid, proceed with submission
    if (isValid) {
      console.log("CTC details are valid. Proceeding with form submission.");

      let req = { ...formData };
      req.addresses = [
        {
          ...permanentAddress,
          type: "Permanent",
        },
        {
          ...currentAddress,
          type: "Current",
        },
      ];
      req.dob = formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : "";

      // Handle specific workflow status if necessary
      // const statusDescription = state?.status || "Default Status";
      // const workflowStatusDescription =
      //   state?.workflowStatusDescription || "Default Status";

      if (
        // statusDescription === "Submitted" &&
        workflowStatusDescription === "203"
      ) {
        console.log("Calling Update");
        handleUpdate(req);
        return;
      }

      // Proceed with creating candidate if CTC validation passes
      createCandidate(req)
        .then(() => {
          console.log("Candidate created successfully");
          navigate("/home/smartHire/candidateList");
          Toaster("success", "Candidate created successfully!");
        })
        .catch((error) => {
          console.error("Error creating candidate:", error);
          Toaster("error", "Error creating candidate. Please try again.");
        });

      resetForm();
    } else {
      alert("Please fix the CTC errors before submitting.");
    }
  };

  const handleUpdate = (formData) => {
    formData.modifiedBy = employeeData ? employeeData?.employeeCode : "";
    if (formData.sameAsPermanent) {
      formData.addresses.forEach((data) => {
        if (data.type === "Current") {
          data.line1 = formData.addresses.find(
            (data) => data.type === "Permanent"
          ).line1;
          data.postalCode = formData.addresses.find(
            (data) => data.type === "Permanent"
          ).postalCode;
          data.city = formData.addresses.find(
            (data) => data.type === "Permanent"
          ).city;
          data.state = formData.addresses.find(
            (data) => data.type === "Permanent"
          ).state;
          data.country = formData.addresses.find(
            (data) => data.type === "Permanent"
          ).country;
        }
      });
    }
    console.log("303 in update", offerRevised);
    if (offerRevised) {
      console.log("Offer Updated in update", offerRevised);
      formData.workflowStatus = "101";
    }
    console.log("Form updated:", formData);
    updateCandidate(candidateId, formData)
      .then(() => {
        console.log("Candidate updated successfully");
        Toaster("success", "Candidate updated successfully!");
        navigate("/home/smartHire/candidateList");
      })
      .catch((error) => {
        console.log("Error updating candidate:", error);
        Toaster("error", "Error updating candidate. Please try again.");
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    uploadOfferLetter(candidateId, formData)
      .then((response) => {
        console.log("File uploaded successfully:", response);
        // Assuming `response` contains the `filePath` field
        setFileUrl(response.filePath); // Set the file URL state
        setFile(file);
        console.log("File url:", fileUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleSendOfferLetter = async () => {
    console.log("Sending offer letter for candidate ID:", candidateId);
    const filePath = await fetchCandidateData(false);
    console.log("Sending offer letter", filePath);
    SendOfferLetter(candidateId, filePath)
      .then(() => {
        console.log("Offer letter sent successfully");
        // Show success toast for sending offer letter
        Toaster("success", "Offer letter sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending offer letter:", error);
        // Show error toast for sending offer letter failure
        Toaster("error", "Error sending offer letter. Please try again.");
      });
  };

  const handleInitiateOnboard = async () => {
    // Validate onBoardData
    let valid = true;
    console.log("Validating onBoardData", formData.nationality);
    console.log(onBoardData);

    //Removed mandatory profile picture validation for now
    // if (!profilePicture) {
    //   Toaster("error", "Please upload a valid 300x300 pixels profile picture.");
    //   setErrors((prev) => ({
    //     ...prev,
    //     profilePicture: "Profile picture is required",
    //   }));
    //   return;
    // }

    for (const [key, value] of Object.entries(onBoardData)) {
      console.log(key, value);

      // Validate UAN only for Indian nationality
      if (key === "uan") {
        if (formData.nationality !== "IND") {
          continue;
        }
        if (!validateUAN(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [key]: `${key} is required`,
          }));
          valid = false; // Mark as invalid
        }
        console.log(valid);
        continue;
      }
      if (!stringNotNullValidation(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: `${key} is required`,
        }));
        valid = false; // Mark as invalid
      }
    }

    if (!valid) {
      console.log("Please enter valid onboarding data", !valid);
      Toaster("error", "Please enter valid onboarding data");
      return;
    }

    const updatedFormData = {
      ...formData,
      initiateOnboard: true,
    };

    console.log("Updated Form", updatedFormData);
    const employeeMapData = mapFormDataToEmployeeModel(
      updatedFormData,
      onBoardData,
      currentAddress,
      permanentAddress
    );
    console.log("Employee Data:", employeeMapData);
    console.log("Initiate Data Push");
    CreateOrUpdateEmployee(employeeMapData)
      .then(async (response) => {
        console.log("Onboarding initiated successfully:", response);
        console.log("After Onboarding initiated", updatedFormData);

        Toaster("success", "Onboarding initiated successfully!");

        if (profilePicture) {
          const formData = new FormData();
          formData.append("file", profilePicture);

          try {
            const uploadResponse = await UploadExpense(
              formData,
              response.employeeCode,
              "profilePic"
            );
            console.log(
              "Profile picture uploaded successfully:",
              uploadResponse
            );
          } catch (uploadErr) {
            console.error("Profile picture upload failed:", uploadErr);
            Toaster(
              "warning",
              "Onboarding done, but profile picture upload failed."
            );
          }
        }

        // ✅ Continue with onboarding flow
        try {
          await OnboardCandidate(candidateId, response.employeeCode);
          navigate("/home/smartHire/candidateList");
          console.log("Email Sent successfully and navigation done.");
        } catch (err) {
          console.error("Error during candidate onboarding:", err);
        }
      })
      .catch((error) => {
        console.error("Error initiating onboarding:", error);
        const fullMessage =
          error?.response?.data?.message || "Something went wrong";

        // Extract the actual message after the colon
        const readableMessage = fullMessage.includes(":")
          ? fullMessage.split(":").pop().trim()
          : fullMessage;

        // Now show the toast
        Toaster("error", readableMessage);
      });
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
    type: "file",
    accept: "application/pdf",
  });

  const handleOfferRevised = () => {
    // Update state or call an API as needed
    setOfferRevised(true); // Enable the Upload button
    setFile({
      name: "",
    });
    setFileUrl(null);
    console.log("File URL changed", fileUrl);
    // Show a confirmation message or perform other actions
    Toaster("success", "Offer has been marked as revised.");
  };

  // Determine if the "Upload file" button should be enabled
  const isUploadButtonEnabled =
    workflowStatusDescription === "200" ||
    workflowStatusDescription === "202" ||
    workflowStatusDescription === "303" ||
    offerRevised;

  console.log("Upload Button Enabled", isUploadButtonEnabled);

  const isSendOfferButtonEnabled =
    workflowStatusDescription === "300" || workflowStatusDescription === "302";

  // Determine if the "303" button should be shown
  const showOfferRevisedButton = workflowStatusDescription === "303" && !hr;

  const isSubmitDisabled = () => {
    console.log("Admin:", admin);
    console.log("HR:", hr);
    console.log("management:", management);
    console.log("budget:", budget);
    if (!admin) {
      return false; // Admins should always have the button enabled
    }

    // If offerRevised is true, button should be enabled only if fileUrl is available
    if (offerRevised) {
      return !fileUrl; // Return true (disable) if fileUrl is not available
    }

    // HR role conditions
    const hrStatusDisabled =
      !hr &&
      (!fileUrl || // Check if file URL is empty or null
        !["200", "303", "202"].includes(workflowStatusDescription));

    const budgetStatusDisabled =
      !budget &&
      (workflowStatusDescription !== "100" || !formData.budgetStatus);

    const managementStatusDisabled =
      !management &&
      (workflowStatusDescription !== "101" || !formData.managementStatus);

    const buttonDisabled =
      hrStatusDisabled || budgetStatusDisabled || managementStatusDisabled;

    console.log("303:", offerRevised);
    console.log("HR Status Disabled:", hrStatusDisabled);
    console.log("Budget Status Disabled:", budgetStatusDisabled);
    console.log("Management Status Disabled:", managementStatusDisabled);
    console.log("Button Disabled:", buttonDisabled);

    return buttonDisabled;
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setProfilePicture(file);
      setPreviewUrl(objectUrl);
      setErrors((prev) => ({ ...prev, profilePicture: "" }));
    };

    img.onerror = () => {
      Toaster("error", "Invalid image file.");
      setProfilePicture(null);
      setPreviewUrl(null);
      setErrors((prev) => ({
        ...prev,
        profilePicture: "Invalid image file",
      }));
    };

    img.src = objectUrl;
  };

  useEffect(() => {
    setCandidateId(urlCandidateId);
  }, [urlCandidateId]);

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 99,
          p: { xs: 1, sm: 2 },
        }}
      >
        <Typography variant="h6" sm="h5" gutterBottom>
          Candidate Form
        </Typography>

        <Box sx={{ mt: 2, mb: 2 }}>
          <ProgressBar workflowStatusDescription={workflowStatusDescription} />
        </Box>

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="form tabs"
        >
          <Tab label="Basic Info" />
          <Tab label="Education" disabled={!tabStatus.education} />
          <Tab label="Employment" disabled={!tabStatus.employment} />
          <Tab label="CTC Details" disabled={!tabStatus.ctcDetails} />
          {workflowStatusDescription !== "Default Status" &&
            workflowStatusDescription !== "10" &&
            workflowStatusDescription !== "400" && <Tab label="Approvals" />}
          {(workflowStatusDescription === "300" ||
            workflowStatusDescription === "302") &&
            !hr && <Tab label="Initiate Onboard" />}
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Typography variant="h6" gutterBottom>
            Requirement Details
          </Typography>
          <ConfigureForm
            data={configureRequirementInfo(formData, errors)}
            handleChange={handleChange}
            readOnly={hr || hrEdit}
            actionsHide={false}
            onBlur={handleBlur}
          />

          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <ConfigureForm
            data={configurePersonalInfo(formData, errors)}
            handleChange={handleChange}
            onBlur={handleBlur}
            readOnly={hr || hrEdit}
            actionsHide={false}
          />

          <Typography variant="h6" gutterBottom>
            Document Details
          </Typography>
          <ConfigureForm
            data={configureDocumentDetails(formData, errors)}
            handleChange={handleChange}
            readOnly={hr || hrEdit}
            actionsHide={false}
            onBlur={handleBlur}
          />

          <ConfigureForm
            data={configureShowPassport(formData, errors)}
            handleChange={handleChange}
            readOnly={hr || hrEdit}
            actionsHide={false}
            onBlur={handleBlur}
          />

          <ConfigureForm
            data={configureShowVisa(formData, errors)}
            handleChange={handleChange}
            readOnly={hr || hrEdit}
            actionsHide={false}
            onBlur={handleBlur}
          />

          <Typography variant="h6" gutterBottom>
            Permanent Address
          </Typography>
          <ConfigureForm
            data={configurePermanentAddress(permanentAddress, errors)}
            handleChange={handlePermanentAddressChange}
            actionsHide={false}
            readOnly={hr || hrEdit}
            onBlur={(e) => handleBlur(e, "permanentAddress")}
          />

          {shouldShowForm && (
            <ConfigureForm
              data={configureSameAsPermanent(formData, errors)}
              handleChange={handleChange}
              actionsHide={false}
              readOnly={hr || hrEdit}
              onBlur={handleBlur}
            />
          )}

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Current Address
            </Typography>
            <ConfigureForm
              data={configureCurrentAddress(currentAddress, errors)}
              handleChange={handleCurrentAddressChange}
              actionsHide={false}
              readOnly={hr || hrEdit || formData.sameAsPermanent}
              onBlur={(e) => handleBlur(e, "currentAddress")}
            />
          </Box>

          {shouldShowForm && (
            <ActionButton
              handleSave={handleSave}
              handleContinue={handleContinue}
              isSaved={isSaved}
            />
          )}
        </Box>
      )}

      {currentTab === 1 && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Typography variant="h6" gutterBottom>
            Education Details
          </Typography>
          {formData.educations.map((edu, index) => (
            <Box
              key={index}
              mb={2}
              border={1}
              borderColor="grey.400"
              p={2}
              borderRadius={1}
            >
              <ConfigureForm
                data={configureEducationData(errors, index)}
                handleChange={(event) => handleEducationChange(index, event)}
                readOnly={hr || hrEdit}
                actionsHide={false}
                onBlur={handleBlur}
              />
              {index !== 0 && (
                <IconButton onClick={() => handleRemoveEducation(index)}>
                  <RemoveCircle color="error" />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={handleAddEducation}
            startIcon={<AddCircle />}
            disabled={hr || hrEdit}
          >
            Add Education
          </Button>

          {shouldShowForm && (
            <ActionButton
              handleSave={handleSave}
              handleContinue={handleContinue}
              isSaved={isSaved}
            />
          )}
        </Box>
      )}

      {currentTab === 2 && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Typography variant="h6" gutterBottom>
            Employment Details
          </Typography>
          {formData.employments.map((emp, index) => (
            <Box
              key={index}
              mb={2}
              border={1}
              borderColor="grey.400"
              p={2}
              borderRadius={1}
            >
              <Typography variant="subtitle1" gutterBottom>
                {index === 0 ? "Current Employment" : "Previous Employment"}
              </Typography>
              <ConfigureForm
                data={configureEmploymentData(errors, index)}
                handleChange={(event) => handleEmploymentChange(index, event)}
                readOnly={hr || hrEdit}
                actionsHide={false}
                onBlur={handleBlur}
              />
              <IconButton onClick={() => handleRemoveEmployment(index)}>
                <RemoveCircle color="error" />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={handleAddEmployment}
            startIcon={<AddCircle />}
            disabled={hr || hrEdit}
          >
            Add Employment
          </Button>

          {shouldShowForm && (
            <ActionButton
              handleSave={handleSave}
              handleContinue={handleContinue}
              isSaved={isSaved}
            />
          )}
        </Box>
      )}

      {currentTab === 3 && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Typography variant="h6" gutterBottom>
            CTC Details
          </Typography>
          <ConfigureForm
            data={configureCtcData(formData, errors)}
            handleChange={handleChange}
            readOnly={hr || hrEdit}
            actionsHide={false}
            actions={false}
            onBlur={handleBlur}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={hr || hrEdit}
          >
            Submit
          </Button>
        </Box>
      )}

      {currentTab === 4 && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Typography variant="h6" gutterBottom>
            Budget Approval
          </Typography>
          <ConfigureForm
            data={configureBudgetApprovalData(formData, errors)}
            handleChange={handleApprovalChange}
            readOnly={budget || workflowStatusDescription !== "100"}
            actionsHide={false}
            actions={false}
            onBlur={handleBlur}
          />

          <Typography variant="h6" gutterBottom>
            Offer Letter Upload
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems="start"
            gap={2}
          >
            <Button
              component="label"
              variant="contained"
              disabled={hr || !isUploadButtonEnabled}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                accept="application/pdf"
              />
            </Button>

            {fileUrl && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  DownloadFile(fileUrl)
                    .then((response) => {
                      if (typeof response === "string") {
                        Toaster("error", `Failed to view file: ${response}`);
                        return;
                      }
                      const url = URL.createObjectURL(response);
                      window.open(url, "_blank");
                    })
                    .catch();
                }}
              >
                <AttachFileIcon sx={{ mr: 1 }} />
                {fileUrl.split("\\").pop().split("/").pop()}
              </Button>
            )}

            {showOfferRevisedButton && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOfferRevised}
              >
                Revise Offer
              </Button>
            )}
          </Box>

          <Typography variant="h6" gutterBottom>
            Management Approval
          </Typography>
          <ConfigureForm
            data={configureManagementApprovalData(formData, errors)}
            handleChange={handleApprovalChange}
            readOnly={management || workflowStatusDescription !== "101"}
            actionsHide={false}
            actions={false}
            onBlur={handleBlur}
          />
          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdate(formData)}
              disabled={isSubmitDisabled()}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={hr || !isSendOfferButtonEnabled}
              onClick={handleSendOfferLetter}
            >
              Send Offer Letter
            </Button>
          </Box>
        </Box>
      )}

      {currentTab === 5 && (
        <Box p={{ xs: 1, sm: 3 }}>
          <Typography variant="h6" gutterBottom>
            Onboarding Initiation
          </Typography>

          <ConfigureForm
            data={configureOnboardingInitiationData(
              onBoardData,
              errors,
              designationData,
              formData
            )}
            handleChange={handleOnboardChange}
            actionsHide={false}
            actions={false}
          />

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <Button
              component="label"
              variant="contained"
              color="primary"
              sx={{ width: "fit-content" }}
              startIcon={<CloudUploadIcon />}
            >
              Upload Profile Picture (300x300)
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfilePictureChange}
              />
            </Button>

            {errors.profilePicture && (
              <Typography color="error" variant="caption">
                {errors.profilePicture}
              </Typography>
            )}

            {previewUrl && (
              <Box>
                <Typography variant="body2">Preview:</Typography>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}
          </Box>

          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="primary"
            onClick={handleInitiateOnboard}
          >
            Initiate Onboard
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CandidateForm;
