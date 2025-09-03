import { Box } from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { GetEmployeeLeaveConfigDetails } from "../../../service/api/nemsService/EmployeeLeaveService";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";

function LeaveDetails({ leaveTypes }) {
  console.log(leaveTypes);
  const [leaveDetailsData, setLeaveDetailsData] = useState([]);
  const { employeeData } = useContext(EmployeeDataContext);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    GetEmployeeLeaveConfigDetails({
      employeeId: employeeData?.employeeBasicDetailId,
    })
      .then((leave) => {
        setLeaveDetailsData(leave);
      })
      .catch((error) => console.log(error));
  };
  const contentConfig = useCallback(
    (data) => {
      return {
        content: data?.map((content) => {
          return [
            {
              forAction: false,
              isPrint: true,
              value: leaveTypes.find(
                (data) => data.leaveTypeCode == content.leaveCode
              )?.leaveTypeDescription,
            },
            {
              isPrint: true,
              forAction: false,
              value: content.opening,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.credited,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.pending,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.used,
            },
            {
              forAction: false,
              isPrint: true,
              value: content.remaining,
            },
          ];
        }),
      };
    },
    [leaveDetailsData]
  );

  return (
    <Box>
      <ConfigTable
        data={contentConfig(leaveDetailsData)}
        headers={[
          "Leave Type",
          "Opening Balance",
          "Credited Leaves",
          "Pending Approval",
          "Leaves Utilised",
          "Balance Leaves",
        ]}
      />
    </Box>
  );
}

export default LeaveDetails;
