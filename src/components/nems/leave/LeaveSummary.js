import { Box, Button, IconButton } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  DeleteEmployeeLeave,
  FindEmployeeLeaves,
} from "../../../service/api/nemsService/EmployeeLeaveService";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import LeaveDetails from "./LeaveDetails";
import { Delete, TroubleshootRounded } from "@mui/icons-material";
import { Toaster } from "../../../common/alertComponets/Toaster";
import dayjs from "dayjs";

const defaultFormData = {
  leaveType: "",
  statusType: "",
  year: "",
};
export const LeaveSummary = ({ leaveData }) => {
  const { employeeData } = useContext(EmployeeDataContext);
  // const [leaveTypes, setLeaveTypes] = useState(leaveData);
  const [panel, setPanel] = useState("leaveDetails");
  const [formData, setFormData] = useState(defaultFormData);
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = [
    { key: currentYear, value: currentYear },
    { key: currentYear - 1, value: currentYear - 1 },
  ];
  useEffect(() => {
    findEmployeeLeaves();
  }, [formData]);

  const findEmployeeLeaves = () => {
    try {
      const payload = {
        employeeId: employeeData?.employeeBasicDetailId,
        leaveType: formData?.leaveType || null,
        status: formData?.statusType || null,
        year: formData?.year || null,
      };
      FindEmployeeLeaves(payload)
        .then((data) => {
          setData(data);
        })
        .catch((error) => console.log(error));
    } catch (error) {}
  };

  const deleteData = useCallback((item) => {
    DeleteEmployeeLeave(item.empLeaveId)
      .then(() => {
        Toaster("success", "Leave Entry is successfully deleted");
        findEmployeeLeaves();
      })
      .catch((error) => console.log(error));
  }, []);

  const actionClick = (event, data) => {
    console.log(event, data);
    switch (event) {
      case "revoke":
        // Revoke leave record
        break;
      case "delete":
        deleteData(data);
        break;
      default:
        break;
    }
  };

  const resetButton = () => {
    setFormData(defaultFormData);
  };
  const configureFormData = useCallback(() => {
    return [
      {
        label: "Leave Type",
        name: "leaveType",
        type: "dropDownList",
        options: leaveData.map((leave) => ({
          key: leave.leaveTypeCode,
          value: leave.leaveTypeDescription,
        })),
        value: formData.leaveType,
      },
      {
        label: "Status Type",
        name: "statusType",
        type: "dropDownList",
        options: [
          {
            value: "Pending for Approval",
            key: "101",
          },
          {
            value: "Approved",
            key: "102",
          },
          {
            value: "Rejected",
            key: "103",
          },
          {
            value: "Revoked",
            key: "104",
          },
        ],
        value: formData.statusType,
      },
      {
        label: "Year",
        name: "year",
        type: "dropDownList",
        options: years,
        value: formData.year,
      },
    ];
  }, [formData, leaveData]);
  const contentConfig = useCallback(
    (input) => {
      return {
        actions: {
          edit: false,
          delete: false,
          view: false,
        },
        content: input?.map((content) => {
          return [
            {
              forAction: false,
              isPrint: true,
              value: leaveData.find(
                (a) => a.leaveTypeCode === content.leaveType
              )?.leaveTypeDescription,
            },

            {
              isPrint: true,
              forAction: false,
              value: `${dayjs(content.leaveFrom).format(
                "DD/MM/YYYY"
              )} to ${dayjs(content.leaveTo).format("DD/MM/YYYY")}`,
            },

            {
              forAction: false,
              isPrint: true,
              value: content.noOfDays,
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.approverName,
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.remarks,
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.statusMasterEntity?.description,
            },
            {
              forAction: true,
              isPrint: false,
              value: { ...content },
              customActions: content.status == "101" && (
                <IconButton
                  color="warning"
                  aria-label="delete"
                  onClick={() => actionClick("delete", content)}
                >
                  <Delete fontSize="small" color="warning" />
                </IconButton>
              ),
            },
          ];
        }),
      };
    },
    [data]
  );
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);
  return (
    <Box component="div">
      <Box display="flex" justifyContent="flex-start" mb={1}>
        <Box mr={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPanel(() => "leaveDetails")}
          >
            Leave Details
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPanel(() => "leaveHistory")}
          >
            Leave History
          </Button>
        </Box>
      </Box>
      {panel === "leaveHistory" && (
        <>
          <ConfigureForm
            data={configureFormData(formData)}
            handleChange={handleChange}
            resetButton={resetButton}
            buttonsHide={{
              reset: true,
              save: false,
            }}
          />
          <ConfigTable
            data={contentConfig(data)}
            headers={[
              "Leave Type",
              "Leave Range",
              "No. of Days",
              "Approver",
              "Approver comments",
              "Status",
              "Action",
            ]}
            actions={actionClick}
          />
        </>
      )}
      {panel === "leaveDetails" && <LeaveDetails leaveTypes={leaveData} />}
    </Box>
  );
};
