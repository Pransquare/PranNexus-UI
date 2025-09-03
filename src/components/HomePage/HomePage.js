import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import { ToastContainer } from "react-toastify";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { UserManagentContext } from "../../customHooks/dataProviders/UserManagementProvider";
import GlobalLoader from "../../customHooks/loading/GlobalLoader";
import { GetEmployeeByEmployeeCode } from "../../service/api/emsService/EmployeeService";
import { GetRoleNamesByUsername } from "../../service/api/login/loginService";
import Chatbot from "../Chatbot/Chatbot";
import Navbar from "../Navbar/Navbar"; // Import Navbar component
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar component
import "./HomePage.css"; // Import the CSS file for HomePage
import ChatBotLayer from "../ChatBotLayer/ChatBotLayer";

const HomePage = () => {
  const location = useLocation();
  const { user } = location.state || {
    user: { name: "Guest", email: "N/A", roles: [] },
  };

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const { employeeData, setEmployeeData } = useContext(EmployeeDataContext);
  const { userManagementData, setuserManagementData } =
    useContext(UserManagentContext);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [chatBotMin, setChatBotMin] = useState(false); // Show Chatbot by default

  useEffect(() => {
    try {
      setTimeout(() => {
        const fetchedApplications = [
          { name: "PMS", description: "Performance Management System", image: "PMS.png" },
          { name: "EMS", description: "Employee Management System", image: "EMS.png" },
          { name: "SmartHire", description: "Hiring Tool", image: "SH.png" },
        ];
        setApplications(fetchedApplications);
        setLoading(false);
      }, 2000);

      if (!userManagementData) {
        GetRoleNamesByUsername(localStorage.getItem("userMailId"))
          .then((data) => {
            setuserManagementData((pre) => ({ ...pre, roleNames: data }));
          })
          .catch();
      }

      if (!employeeData) {
        GetEmployeeByEmployeeCode(localStorage.getItem("userId"))
          .then((result) => {
            result && setEmployeeData(result);
          })
          .catch((re) => {
            console.log(re);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [userManagementData, employeeData]);

  const layerClicked = () => {
    setChatBotMin((prev) => !prev);
  };

  return (
    <Box component="div">
      <div className="page">
        <Navbar
          user={user}
          toggleSidebar={() => {
            setOpenSideBar(!openSideBar);
          }}
          className="fixed-top"
        />
        <Sidebar
          className="fixed-left"
          open={openSideBar}
          oncloseSideBar={() => {
            setOpenSideBar(false);
          }}
        />

        {loading ? (
          <div className="loading-screen">
            <FadeLoader color="#ff6303" />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100vh",
              overflowY: "auto",
              padding: 5,
            }}
            className="border-y-black"
          >
            <ToastContainer />
            <GlobalLoader />
            <Outlet context={{ user }} />

            {/* Chatbot should be open by default */}
            {userManagementData?.roleNames?.find((a) => a === "chat_bot") &&
              (chatBotMin ? (
                <ChatBotLayer layerClicked={layerClicked} />
              ) : (
                <Chatbot minimizeClick={layerClicked} />
              ))}
          </div>
        )}
      </div>
    </Box>
  );
};

export default HomePage;