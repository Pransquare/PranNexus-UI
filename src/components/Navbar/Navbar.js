import React, { useContext, useEffect, useState, useCallback } from "react";
import "./Navbar.css";
import logo from "../../assets/Images/pransquare.jpg";
import avatarSvg from "../../assets/Images/avatar.svg";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ResetPasswordModal from "../ResetPassword/ResetPasswordModal";
import { useNavigate } from "react-router-dom";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllDesignations } from "../../service/api/DesinationService";
import { GetGroups } from "../../service/api/pmsService/GetGroups";
import EmployeeDetails from "../details/EmployeeDetails/EmployeeDetails";
import ContentDailog from "../../common/customComponents/Dailogs/ContentDailog";
import { Box } from "@mui/system";
import { MenuSharp } from "@mui/icons-material";
import NotificationCount from "./NotificationCount";
import NotificationList from "./NotificationList";
import { GetEmployeeByEmployeeCode } from "../../service/api/nemsService/EmployeeService";
import { GetAllWorkLocation } from "../../service/api/hrConfig/hrConfig";
import { UserManagentContext } from "../../customHooks/dataProviders/UserManagementProvider"; // Import UserManagement Context

const Navbar = ({ user, toggleSidebar }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [apiData, setApiData] = useState();
  const [fullName, setFullName] = useState(""); // State to store fullName
  const [employeeCode, setEmployeeCode] = useState(""); // State to store employeeCode
  const navigate = useNavigate();
  const { employeeData, setEmployeeData } = useContext(EmployeeDataContext);
  const { userManagementData } = useContext(UserManagentContext); // Access UserManagement Context

  const toggleNotification = () => {
    setShowNotification(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (content) => {
    setModalContent(content);
    setOpenModal(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePasswordReset = (username, newPassword) => {
    console.log(`Resetting password for ${username}: ${newPassword}`);
  };

  const fetchEmployeeDetails = useCallback(async () => {
    try {
      const employeeCode = localStorage.getItem("userId");
      if (!employeeCode) return;
      const response = await GetEmployeeByEmployeeCode(employeeCode);
      if (response) {
        setFullName(response.fullName); // Set the fullName from response
        setEmployeeCode(response.employeeCode); // Set the employeeCode from response
      }
    } catch (error) {
      console.error("Error fetching employee details: ", error);
    }
  }, []);

  const onloadData = async () => {
    try {
      const data = await Promise.all([
        GetAllDesignations(),
        GetGroups(),
        GetAllWorkLocation(),
      ]);
      setApiData({
        designations: data[0],
        groups: data[1],
        workLocation: data[2],
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const hasRole = (roleName) =>
    userManagementData?.roleNames?.includes(roleName);

  useEffect(() => {
    onloadData();
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails]);

  return (
    <div className="navbar border-b-2">
      <div className="logo-container">
        <IconButton onClick={toggleSidebar}>
          <MenuSharp className="icon" color="primary" />
        </IconButton>
        <img
          src={logo}
          alt="Company Logo"
          className="logo"
          onClick={() => {
            navigate("/home");
          }}
        />
      </div>

      <div className="navbar-content">
        <Typography
          sx={{
            fontWeight: "bold",
            marginTop: "0.5rem",
            "@media (max-width: 600px)": {
              display: "none",
            },
          }}
        >
          {employeeData?.fullName}
        </Typography>
        <IconButton onClick={() => navigate("/home")}>
          <HomeOutlinedIcon
            className="icon"
            sx={{ fontSize: 30 }}
            color="primary"
          />
        </IconButton>
        <NotificationCount openNotification={toggleNotification} />

        {showNotification && (
          <NotificationList
            onClose={() => {
              if (showNotification) {
                setShowNotification(false);
              }
            }}
          />
        )}

        {/* Avatar and Dropdown */}
        <div className="avatar-container">
          <IconButton onClick={handleClick} size="small">
            <Avatar src={avatarSvg} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {hasRole("hr_tools_nems_profile") &&
              !employeeData?.genericProfile && (
                <MenuItem
                  onClick={() => handleMenuItemClick("Profile Content")}
                >
                  Profile
                </MenuItem>
              )}
            <MenuItem onClick={() => handleMenuItemClick("Reset Password")}>
              Reset Password
            </MenuItem>
            <MenuItem
              onClick={() => {
                setEmployeeData(null);
                window.localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>

      {/* Reset Password Modal */}
      {modalContent === "Reset Password" && (
        <ResetPasswordModal
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handlePasswordReset}
          username={user.name} // Assuming user object contains username
        />
      )}
      {modalContent === "Profile Content" && (
        <ContentDailog
          openDialog
          handleCloseDialog={() => setModalContent("")}
          content={
            <Box component="div">
              <EmployeeDetails
                inputData={employeeData}
                apiData={apiData}
                readOnly={true}
                disableAllFields={true}
              />
            </Box>
          }
          okText={null}
          cancelText="Close"
        />
      )}
    </div>
  );
};

export default Navbar;
