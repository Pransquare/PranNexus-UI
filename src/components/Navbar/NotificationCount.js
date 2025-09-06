import React, { useState, useEffect, useContext } from "react";
import Badge from "@mui/material/Badge"; // Import Badge component from MUI
import NotificationsIcon from "@mui/icons-material/Notifications"; // Import Notifications icon from MUI
import { IconButton } from "@mui/material";
import { Environment } from "../../environments/Environment";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const NotificationCount = ({ openNotification }) => {
  const [notificationsCount, setNotificationsCount] = useState(0);

  const { employeeData } = useContext(EmployeeDataContext);
  useEffect(() => {
    if (employeeData) {
      const eventSource = new EventSource(
        `${Environment.nemsUrl}/notification/count/${employeeData?.employeeBasicDetailId}`
      );

      eventSource.onmessage = (event) => {
        const count = parseInt(event.data, 10);
        setNotificationsCount(count);
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [employeeData]);

  return (
    <IconButton color="inherit" onClick={openNotification}>
      <Badge badgeContent={notificationsCount} color="warning">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationCount;
