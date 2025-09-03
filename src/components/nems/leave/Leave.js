import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllLeaveTypes } from "../../../service/api/LeaveTypeService";
import {
  createOrUpdateEmployeeLeave,
  DeleteEmployeeLeave,
  GetEmployeeLeaveConfigDetails,
  GetEmployeeLeaveDetails,
  GetManagerName,
} from "../../../service/api/nemsService/EmployeeLeaveService";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { differenceInDays } from "date-fns";
import { LeaveSummary } from "./LeaveSummary";
import { LeaveApprovals } from "./LeaveApprovals";
import { UserManagentCheck } from "../../../common/UserManagement";
import dayjs from "dayjs";
import LeaveReport from "./LeaveReport";

const defaultFormData = {
  empLeaveId: null,
  leaveType: "",
  leaveRange: "",
  fromDayType: "full",
  toDayType: "full",
  remarks: "",
  noOfDays: 0,
  reason: "",
};

const defaultErrors = {
  empLeaveId: null,
  leaveType: "",
  leaveRange: "",
  fromDayType: "",
  toDayType: "",
  remarks: "",
  reason: "",
};

const leaveTypeLists = [
  {
    key: "full",
    value: "Full Day",
  },
  {
    key: "first",
    value: "First Half",
  },
  {
    key: "second",
    value: "Second Half",
  },
];

function Leave() {
  const [tabsVlaue, setTabsValue] = useState(0);
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState(defaultErrors);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [disableForm, setDisableForm] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [remainingLeaves, setRemainingLeaves] = useState(null);
  const [managerName, setManagerName] = useState("");

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
        "leave",
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

  const validate = () => {
    let tempErrors = { ...defaultErrors };
    let isValid = true;

    if (!formData.leaveType) {
      tempErrors.leaveType = "Leave Type is required.";
      isValid = false;
    }

    if (!formData.leaveRange) {
      tempErrors.leaveRange = "Leave Range is required.";
      isValid = false;
    }

    if (!formData.fromDayType) {
      tempErrors.fromDayType = "From Day Type is required.";
      isValid = false;
    }
    if (!formData.toDayType) {
      tempErrors.toDayType = "To Day Type is required.";
      isValid = false;
    }
    if (!formData.reason) {
      tempErrors.reason = "Reason is required.";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const contentConfig = useCallback(
    (input) => {
      return {
        actions: {
          edit: true,
          delete: true,
          view: true,
        },
        content: input.map((content) => {
          return [
            {
              forAction: false,
              isPrint: true,
              value: leaveData.find(
                (data) => data.leaveTypeCode === content.leaveType
              )?.leaveTypeDescription,
            },
            {
              isPrint: true,
              forAction: false,
              value: content.leaveRange,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.noOfDays,
            },
            {
              forAction: false,
              isPrint: true,
              value: leaveTypeLists.find((d) => d.key === content.fromLeaveType)
                ?.value,
            },
            {
              forAction: false,
              isPrint: true,
              value: leaveTypeLists.find((d) => d.key === content.toLeaveType)
                ?.value,
            },
            {
              forAction: true,
              isPrint: false,
              value: { ...content },
            },
          ];
        }),
      };
    },
    [leaveData, data, formData]
  );

  const configureFormData = useCallback(
    (formData) => {
      return [
        {
          label: "Leave Type",
          name: "leaveType",
          type: "dropDownList",
          value: formData.leaveType,
          options: leaveData.map((leave) => ({
            key: leave.leaveTypeCode,
            value: leave.leaveTypeDescription,
          })),
          error: errors.leaveType,
          required: true,
        },
        {
          label: "Leave Range",
          name: "leaveRange",
          type: "dateRangePicker",
          value: formData.leaveRange,
          error: errors.leaveRange,
          required: true,
          minDate: employeeData?.dateOfJoining
            ? dayjs(employeeData?.dateOfJoining).toDate()
            : undefined,
          maxDate: formData.leaveType === "L001" ? new Date() : undefined,
        },
        {
          label: "From Day Type",
          name: "fromDayType",
          type: "dropDownList",
          value: formData.fromDayType,
          options: leaveTypeLists,
          error: errors.fromDayType,
          disable: !!!formData.leaveRange,
          required: true,
        },
        {
          label: "To Day Type",
          name: "toDayType",
          type: "dropDownList",
          value: formData.toDayType,
          options: leaveTypeLists,
          error: errors.toDayType,
          disable: !!!formData.leaveRange,
        },
        {
          label: "No of Days",
          name: "noOfDays",
          type: "text",
          value: formData.noOfDays,
          readOnly: true,
        },
        {
          label: "Reason",
          name: "reason",
          type: "textarea",
          value: formData.reason,
          error: errors.reason,
          required: true,
        },
      ];
    },
    [formData, errors, leaveData]
  );

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      if (name === "leaveType") {
        GetEmployeeLeaveConfigDetails({
          employeeId: employeeData?.employeeBasicDetailId,
          leaveCode: value,
        })
          .then((leave) => {
            if (leave.length) {
              if (leave[0].unlimited) {
                setRemainingLeaves(Infinity);
              } else {
                setRemainingLeaves(leave[0]?.remaining);
              }
            } else {
              Toaster("error", "No Leaves is configures for employee");
            }
          })
          .catch((error) => console.log(error));
      }
      if (
        name === "leaveRange" ||
        name === "fromDayType" ||
        name === "toDayType"
      ) {
        let range;
        let fromDayType;
        let toDayType;
        switch (name) {
          case "leaveRange":
            range = value;
            fromDayType = "full";
            toDayType = "full";
            break;
          case "fromDayType":
            range = formData.leaveRange;
            fromDayType = value;
            toDayType = formData.toDayType;
            break;
          case "toDayType":
            range = formData.leaveRange;
            toDayType = value;
            fromDayType = formData.fromDayType;
            break;
          default:
            break;
        }
        const [fromDate, toDate] = range.split("to");
        const noOfDays =
          differenceInDays(new Date(toDate), new Date(fromDate)) + 1;
        if (
          (name === "fromDayType" || name === "toDayType") &&
          noOfDays === 1
        ) {
          if (value !== "full") {
            setFormData((prev) => ({
              ...prev,
              fromDayType: value,
              toDayType: value,
              noOfDays: 0.5,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              fromDayType: value,
              toDayType: value,
              noOfDays: 1,
            }));
          }
          return;
        }
        if (name === "leaveRange") {
          setFormData((prev) => ({
            ...prev,
            noOfDays: noOfDays,
            fromDayType: "full",
            toDayType: "full",
            [name]: value,
          }));
        }
        // Calculate the number of days considering the leave types
        let calculatedNoOfDays = noOfDays;
        if (fromDayType && toDayType) {
          if (calculatedNoOfDays === 1) {
            if (fromDayType !== toDayType) {
              Toaster("error", "Please select same day types");
              setFormData((prev) => ({
                ...prev,
                fromDayType: "full",
                toDayType: "full",
              }));
              return;
            }
            if (fromDayType === "first" || fromDayType === "second") {
              calculatedNoOfDays = 0.5;
            }
          } else {
            if (fromDayType === "first" || toDayType === "second") {
              if (fromDayType === "first") {
                Toaster(
                  "error",
                  "The 'First Half' option is not allowed for 'From Day Type' when applying for multiple days of leave."
                );
              } else {
                Toaster(
                  "error",
                  "The 'Second Half' option is not allowed for 'To Day Type' when applying for multiple days of leave."
                );
              }
              setFormData((prev) => ({
                ...prev,
                fromDayType: "full",
                toDayType: "full",
                noOfDays: calculatedNoOfDays,
              }));
              return;
            }
            if (fromDayType !== "full" && toDayType !== "full") {
              calculatedNoOfDays -= 1;
            } else if (fromDayType === "full" && toDayType === "full") {
              calculatedNoOfDays = calculatedNoOfDays;
            } else {
              calculatedNoOfDays -= 0.5; // Subtract 0.5 day for two half days
            }
          }
        }
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
          noOfDays: calculatedNoOfDays,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }

      // Clear the error message for the field
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value ? "" : prevErrors[name],
      }));
    },
    [employeeData?.employeeBasicDetailId, formData]
  );

  const handleSubmit = useCallback(async () => {
    try {
      if (validate()) {
        if (
          formData.exitingNoOfDays &&
          formData.noOfDays - formData.exitingNoOfDays > remainingLeaves
        ) {
          Toaster("error", "You don't have enough leave balance.");
          return;
        }
        if (!formData.exitingNoOfDays && formData.noOfDays > remainingLeaves) {
          Toaster("error", "You don't have enough leave balance.");
          return;
        }
        const payLoad = {
          ...formData,
          leaveFrom: formData.leaveRange.split("to")[0].trim(),
          leaveTo: formData.leaveRange.split("to")[1].trim(),
          fromLeaveType: formData.fromDayType,
          toLeaveType: formData.toDayType,
          employeeLeaveId: formData.empLeaveId,
          user: "mani",
          employeeId:
            employeeData?.employeeBasicDetailId ||
            (() => {
              throw new Error("Employee ID is required");
            })(),
        };
        await createOrUpdateEmployeeLeave(payLoad)
          .then(() => {
            getEmployeeLeaveDetails();
            Toaster("success", "Leave is submited.");
            resetForm();
          })
          .catch((error) => {
            const status = error?.response?.status;
            const backendMessage = error?.response?.data?.message;

            console.error("Leave submission error:", error);

            switch (status) {
              case 400:
                Toaster(
                  "error",
                  backendMessage ||
                    "Bad request. Please check the entered details."
                );
                break;
              case 401:
                Toaster("error", "Unauthorized. Please log in again.");
                break;
              case 403:
                Toaster(
                  "error",
                  "Forbidden. You don't have permission to perform this action."
                );
                break;
              case 404:
                Toaster(
                  "error",
                  backendMessage ||
                    "Leave service is currently unavailable or not found."
                );
                break;
              case 409:
                Toaster(
                  "error",
                  backendMessage ||
                    "Conflict. The leave entry may already exist."
                );
                break;
              case 500:
                Toaster(
                  "error",
                  "Internal server error. Please try again later."
                );
                break;
              default:
                if (backendMessage) {
                  Toaster("error", backendMessage);
                } else {
                  Toaster(
                    "error",
                    "An unexpected error occurred. Please try again."
                  );
                }
                break;
            }
          });
      } else {
        Toaster("error", "Please enter a valid content");
      }
    } catch (error) {
      Toaster("error", "Failed to submit leave");
    }
  }, [formData, data, contentConfig, remainingLeaves]);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setErrors(defaultErrors);
    setRemainingLeaves(null);
    setDisableForm(false);
  }, []);

  const getEmployeeLeaveDetails = useCallback(() => {
    GetEmployeeLeaveDetails(employeeData?.employeeBasicDetailId)
      .then((response) => {
        response = response.map((d) => {
          const formattedFrom = dayjs(d.leaveFrom).format("DD/MM/YYYY");
          const formattedTo = dayjs(d.leaveTo).format("DD/MM/YYYY");

          return {
            ...d,
            leaveRange: `${formattedFrom} to ${formattedTo}`,
            fromDayType: d.fromLeaveType,
            toDayType: d.toLeaveType,
          };
        });

        setData(response);
      })
      .catch(() => {
        setData([]);
        Toaster("error", "Failed to fetch Leave Details.");
      });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const leaveTypes = await GetAllLeaveTypes();
      setLeaveData(leaveTypes);
      getEmployeeLeaveDetails();
    } catch (error) {
      Toaster("error", "Failed to fetch Clients or Projects.");
    }
  }, []);

  useEffect(() => {
    console.log("useeffect");
    fetchData();
    setHeaders([
      "Leave Type",
      "Leave Range",
      "No. of Days",
      "From Day Type",
      "To Day Type",
      "Action",
    ]);
  }, [fetchData]);

  const editData = useCallback(
    (data) => {
      resetForm();
      setFormData({ ...data, exitingNoOfDays: data.noOfDays });
      setErrors(defaultErrors);
      setDisableForm(false);
      handleChange({
        target: {
          name: "leaveType",
          value: data.leaveType,
        },
      });
    },
    [resetForm]
  );

  const viewData = useCallback((data) => {
    setFormData(data);
    setDisableForm(true);
  }, []);

  const deleteData = useCallback(
    (item) => {
      DeleteEmployeeLeave(item.empLeaveId)
        .then(() => {
          Toaster("success", "Leave Entry is successfully deleted");
          getEmployeeLeaveDetails();
        })
        .catch((error) => console.log(error));
    },
    [getEmployeeLeaveDetails]
  );

  const actionClick = useCallback(
    (event, item) => {
      switch (event) {
        case "edit":
          editData(item);
          break;
        case "delete":
          deleteData(item);
          break;
        case "view":
          viewData(item);
          break;
        default:
          break;
      }
    },
    [editData, deleteData, viewData]
  );

  // Tabs change functionality starts here
  const tabsChange = (event, value) => {
    if (value === 0) {
      setFormData(defaultFormData);
      fetchData();
    }
    setTabsValue(value);
    console.log(value); // For testing purposes, replace console.log with your own logic.
  };

  const LeaveApply = () => {
    return (
      <>
        <Box
          component="div"
          textAlign="end"
          display="flex"
          justifyContent="end"
        >
          <Typography variant="subtitle1" marginRight="10px">
            Manager Name:
          </Typography>
          <Typography
            variant="subtitle1"
            marginRight="20px" // Add margin to create space
            color={managerName !== "N/A" ? "primary" : "error"}
          >
            {managerName}
          </Typography>
          <Typography variant="subtitle1" marginRight="10px">
            Remaining Leaves:
          </Typography>
          <Typography
            variant="subtitle1"
            color={remainingLeaves ? "primary" : "error"}
          >
            {remainingLeaves}
          </Typography>
        </Box>

        <ConfigureForm
          data={configureFormData(formData)}
          buttonTitle="Submit"
          handleChange={handleChange}
          submitClicked={handleSubmit}
          resetButton={resetForm}
          formDisabled={disableForm}
        />

        <ConfigTable
          data={contentConfig(data)}
          headers={headers}
          actions={actionClick}
        />
      </>
    );
  };

  const leaveSummaryAction = (action) => {
    // Add your own logic for handling the leave summary action
    console.log("Leave Summary Action: ", action); // For testing purposes, replace console.log with your own logic.
  };

  const tabsContainer = () => {
    return (
      <Box
        component="div"
        sx={{
          p: 2,
        }}
      >
        {tabsVlaue === 0 && LeaveApply()}
        {tabsVlaue === 1 && (
          <LeaveSummary
            leaveData={leaveData}
            actionClick={leaveSummaryAction}
          />
        )}
        {tabsVlaue === 2 && <LeaveApprovals leaveData={leaveData} />}
        {tabsVlaue === 3 && <LeaveReport />}
      </Box>
    );
  };
  // Tabs change functionality ends here

  useEffect(() => {
    if (employeeData?.genericProfile) {
      setTabsValue(3);
    }
  }, [employeeData?.genericProfile]);

  return (
    <Box sx={{ ...panelStyle, p: 0 }} component="div">
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px",
            minWidth: "50px",
            padding: "6px 12px",
          },
          "& .MuiTab-wrapper": {
            marginTop: "0",
          },
        }}
        value={tabsVlaue}
        onChange={tabsChange}
        variant="scrollable"
      >
        {UserManagentCheck("hr_tools_nems_leave_leaveApply") &&
          !employeeData?.genericProfile && (
            <Tab label="Leave Apply" value={0} />
          )}
        {UserManagentCheck("hr_tools_nems_leave_leaveSummary") &&
          !employeeData?.genericProfile && (
            <Tab label="Leave Summary" value={1} />
          )}
        {UserManagentCheck("hr_tools_nems_leave_leaveApproval") &&
          !employeeData?.genericProfile && (
            <Tab label="Leave Approvals" value={2} />
          )}
        {UserManagentCheck("hr_tools_nems_leave_report") && (
          <Tab label="Leave Report" value={3} />
        )}
      </Tabs>
      {tabsContainer()}
    </Box>
  );
}

export default Leave;
