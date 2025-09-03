import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Box, Typography } from "@mui/material";

// Set up the localizer
const localizer = momentLocalizer(moment);

const LeaveCalendar = ({ leaveData }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  // Aggregate leave counts by date
  const dateCounts = leaveData.reduce((acc, member) => {
    member.leaves.forEach((leave) => {
      const date = moment(leave.date).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = { count: 0, names: [] };
      }
      acc[date].count += 1;
      if (!acc[date].names.includes(member.memberName)) {
        acc[date].names.push(member.memberName);
      }
    });
    return acc;
  }, {});

  // Convert dateCounts to events format
  const events = Object.keys(dateCounts).map((date) => ({
    title:
      dateCounts[date].count > 1
        ? `${dateCounts[date].count} on leave`
        : `${dateCounts[date].names[0]}`,
    start: new Date(date),
    end: new Date(date),
    allDay: true,
    resource: dateCounts[date],
  }));

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  // Style for events
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: "green", // Set background color to green
      borderRadius: "5px", // Optional: Remove border radius
      fontSize: "0.8rem", // Optional: Remove font size
    },
  });

  const styles = {
    calendarContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "50px",
    },
    calendar: {
      width: "70%",
      maxWidth: "1200px",
      height: 350,
    },
    modalStyle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      backgroundColor: "#fff",
      border: "2px solid #000",
      boxShadow: 24,
      padding: "20px",
      borderRadius: "8px",
    },
  };

  return (
    <>
      <div style={styles.calendarContainer}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={{ month: true }}
          defaultView="month"
          style={styles.calendar}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter} // Apply styles to events
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={styles.modalStyle}>
          <Typography variant="h6" gutterBottom>
            Leaves on {moment(selectedEvent?.start).format("YYYY-MM-DD")}
          </Typography>
          <Typography variant="body1">
            Number of Leaves: {selectedEvent?.resource?.count}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedEvent?.resource?.count > 1
              ? `Names of Members: ${selectedEvent?.resource?.names.join(", ")}`
              : `Name of Member: ${selectedEvent?.resource?.names[0]}`}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default LeaveCalendar;
