import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import {
  FetchNotifications,
  MarkNotificationAsRead,
} from "../../service/api/emsService/NotificationService";
import "./Navbar.css"; // Import the CSS file for Navbar

const NotificationList = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeData } = useContext(EmployeeDataContext);
  const notificationRef = useRef(null); // Ref to track the notification component
  const navigation = useNavigate();

  const fetchNotifications = async () => {
    try {
      FetchNotifications(employeeData?.employeeBasicDetailId)
        .then((response) => {
          setNotifications(response);
          setLoading(false);
        })
        .catch();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Add event listener to detect clicks outside the notification component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        onClose(); // Call the onClose function when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleClearAll = () => {
    MarkNotificationAsRead(null, employeeData?.employeeBasicDetailId)
      .then((res) => {
        if (res) {
          fetchNotifications();
        }
      })
      .catch();
  };

  const notificationClicked = (notification) => {
    MarkNotificationAsRead(notification.notificationId, null)
      .then((res) => {
        if (res) {
          fetchNotifications();
          navigation(notification.path);
        }
      })
      .catch();
  };

  useEffect(() => {
    fetchNotifications();
  }, [employeeData]);

  return (
    <div
      ref={notificationRef}
      className="notification"
      style={{ zIndex: 111111 }}
    >
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <React.Fragment key={notification.notificationId}>
              <ListItemButton
                onClick={() => {}}
                dense={true}
                sx={{ padding: "0px 5px" }} // Decreased padding
                onClickCapture={() => {
                  notificationClicked(notification);
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      style={{ fontSize: "14px" }}
                    >
                      {notification.module}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" style={{ fontSize: "12px" }}>
                      {notification.message}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No notifications available" />
          </ListItem>
        )}
      </List>
      {notifications.length > 0 && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClearAll}
          style={{ marginTop: "10px" }}
        >
          Clear All
        </Button>
      )}
    </div>
  );
};

export default NotificationList;
