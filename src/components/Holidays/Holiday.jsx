import React, { useState, useEffect, useCallback, useContext } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { GetAllHolidays } from "../../service/api/HolidayService";
import ConfigTable from "../../common/customComponents/ConfigTable";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const Holiday = () => {
  const [holidays, setHolidays] = useState([]); // Store holidays data
  const [loading, setLoading] = useState(true);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]); // Store formatted holidays data
  const { employeeData } = useContext(EmployeeDataContext); // Access employee data

  // Function to fetch holidays from API
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      // Pass the workLocationCode properly as an argument in the object
      const holidaysResult = await GetAllHolidays({
        workLocation: employeeData?.workLocationCode,
      });
      setHolidays(holidaysResult); // Set holidays data after fetching
      setData(holidaysResult); // Set holidays data after fetching
      setLoading(false);
    } catch (error) {
      console.log("Error fetching holidays:", error);
      setLoading(false);
    }
  };

  const contentConfig = useCallback((input) => {
    return {
      content: input?.map((holiday) => [
        {
          isPrint: true,
          forAction: false,
          value: dayjs(holiday.holidayDate).format("DD MMMM YYYY"), // Format the date
        },
        {
          isPrint: true,
          forAction: false,
          value: holiday.holidayDescription || "", // Holiday reason
        }
      ]),
    };
  }, []);

  // Set headers when the component mounts
  useEffect(() => {
    setHeaders(["Date", "Reason"]);
  }, []);

  // Fetch holidays when employeeData changes (when the workLocationCode is available)
  useEffect(() => {
    if (employeeData?.workLocationCode) {
      fetchHolidays(); // Only fetch holidays if workLocationCode exists
    }
  }, [employeeData]); // Run this effect whenever employeeData changes

  // Loading state
  if (loading) {
    return <Typography variant="body1">Loading holidays...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Holiday List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <ConfigTable
          data={contentConfig(data)} // Pass the formatted holidays data
          headers={headers}
          alignment={[
            "left",
            "left"
          ]}
        />
      )}
    </Box>
  );
};

export default Holiday;
