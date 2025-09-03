import React from "react";
import LeaveCalendar from "./LeaveCalendar";

const leaveData = [
  {
    memberId: 1,
    memberName: "John Doe",
    leaves: [
      { date: "2024-08-20", reason: "Sick Leave" },
      { date: "2024-08-21", reason: "Vacation" },
      { date: "2024-08-23", reason: "Personal Leave" },
    ],
  },
  {
    memberId: 2,
    memberName: "Jane Smith",
    leaves: [
      { date: "2024-08-20", reason: "Sick Leave" },
      { date: "2024-08-21", reason: "Vacation" },
      { date: "2024-08-23", reason: "Personal Leave" },
    ],
  },
  {
    memberId: 3,
    memberName: "Bob Johnson",
    leaves: [
      { date: "2024-08-20", reason: "Sick Leave" },
      { date: "2024-08-21", reason: "Vacation" },
      { date: "2024-08-27", reason: "Personal Leave" },
    ],
  },
  // More team members...
];
const ManagerDashboard = () => {
  return (
    <div>
      <LeaveCalendar leaveData={leaveData} />
    </div>
  );
};

export default ManagerDashboard;
