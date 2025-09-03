import { Box } from "@mui/material";
import { addDays, format, isWeekend } from "date-fns";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

// Example holiday dates (New Year's Day, Christmas Day)
const holidays = ["2024-01-01", "2024-12-25"];

function CustomDateRangeInput({ valueChange, name, value, minDate, maxDate }) {
  const [state, setState] = useState([
    {
      startDate: value ? new Date(value.split("to")[0].trim()) : new Date(),
      endDate: value ? new Date(value.split("to")[1].trim()) : new Date(),
      key: "selection",
    },
  ]);

  const handleDateChange = (item) => {
    setState([item.selection]);
  };

  useEffect(() => {
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");
    valueChange({
      target: {
        name: name,
        value: `${startDate} to ${endDate}`,
      },
    });
  }, [state]);

  // Function to check if a date is a holiday
  const isHoliday = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return holidays.includes(formattedDate);
  };

  // Generate an array of disabled dates including weekends and holidays
  const generateDisabledDates = (start, end) => {
    let dates = [];
    for (let i = start; i <= end; i = addDays(i, 1)) {
      if (isWeekend(i) || isHoliday(i)) {
        dates.push(i);
      }
    }
    return dates;
  };

  // Define the start and end dates for the range you want to disable
  const start = new Date("2020-01-01"); // Adjust the start date as needed
  const end = new Date("2025-12-31"); // Adjust the end date as needed

  const disabledDates = generateDisabledDates(start, end);

  return (
    <Box component="div" position="absolute" zIndex={999}>
      <DateRange
        editableDateInputs={true}
        onChange={handleDateChange}
        moveRangeOnFirstSelection={false}
        ranges={state}
        showDateDisplay={true}
        disabledDates={disabledDates}
        minDate={minDate}
        maxDate={maxDate}
      />
    </Box>
  );
}

export default CustomDateRangeInput;
