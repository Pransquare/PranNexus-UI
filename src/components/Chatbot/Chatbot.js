import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PropTypes from "prop-types";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Fab,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import botIcon from "../../assets/Images/chat bot icon.png";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeeLeaveConfigDetails } from "../../service/api/nemsService/EmployeeLeaveService";
import {
  DownloadOrViewPayslip,
  GetPayrollDetailsByEmployeeID,
} from "../../service/api/nemsService/Payroll";
import { GetAllHolidays } from "../../service/api/HolidayService";
import { Remove } from "@mui/icons-material";

function Chatbot({ minimizeClick }) {
  const { employeeData } = useContext(EmployeeDataContext);
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chat window
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm here to help. How can I assist you today?",
      sender: "bot",
    },
  ]);
  const [showOptions, setShowOptions] = useState(true);
  const [isSubOptions, setIsSubOptions] = useState(false); // Track sub-options state
  const messagesEndRef = useRef(null); // Reference for the messages end
  const navigate = useNavigate();

  // Predefined options
  const [options, setOptions] = useState([
    {
      label: "Check my leave balance",
    },
    {
      label: "Apply for leave",
    },
    {
      label: "Timesheet Entry",
    },
    {
      label: "payslip",
      subOptions: [],
    },
    {
      label: "View holiday calendar",
    },
    {
      label: "How can I contact HR?",
    },
  ]);
  const getMonthIndex = (monthName) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(monthName);
  };

  const tableStructure = (data) => {
    return (
      <Box>
        <TableContainer component={Paper}>
          <Table aria-label="leave summary table" size="small">
            <TableBody>
              {data?.map((a, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2">{a.label}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{a.value}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  const leaveBalanceFetch = async () => {
    const leaveResult = await GetEmployeeLeaveConfigDetails({
      employeeId: employeeData?.employeeBasicDetailId,
    });
    let leaveData = {
      leaveBalance: 0,
      leaveTakenThisYear: 0,
      pendingLeaveRequests: 0,
    };
    for (const leave of leaveResult) {
      leaveData.leaveBalance += leave.remaining;
      leaveData.leaveTakenThisYear += leave.used;
      leaveData.pendingLeaveRequests += leave.pending;
    }
    setMessages((prev) => [
      ...prev,
      {
        text: tableStructure([
          {
            label: "Available Leave Balance",
            value: leaveData.leaveBalance,
          },
          {
            label: "Leave Utilized This Year",
            value: leaveData.leaveTakenThisYear,
          },
          {
            label: "Pending Leave Days",
            value: leaveData.pendingLeaveRequests,
          },
        ]),
        sender: "bot",
      },
    ]);
  };
  const generateHolidayCalender = async () => {
    const holidaysResult = await GetAllHolidays({
      worklocation: employeeData?.workLocationCode,
    });
    setMessages((prev) => [
      ...prev,
      {
        text: tableStructure(
          holidaysResult
            ?.sort((a, b) => dayjs(a.holidayDate).diff(dayjs(b.holidayDate)))
            .map((a) => ({
              label: dayjs(a.holidayDate).format("DD/MMM/YY"),
              value: a.holidayDescription,
            }))
        ),
        sender: "bot",
      },
    ]);
  };

  const responseGenerators = (option) => {
    switch (option.label) {
      case "Check my leave balance":
        leaveBalanceFetch();
        break;
      case "Apply for leave":
        setMessages((prev) => [
          ...prev,
          {
            text: "Applying for leave. Redirecting now…",
            sender: "bot",
          },
        ]);
        setTimeout(() => {
          navigate("/home/nems/leave");
        }, 1000);
        break;
      case "View holiday calendar":
        generateHolidayCalender();
        break;
      case "How can I contact HR?":
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: (
              <span>
                You can contact the HR department by:
                <br />
                <strong>Email:</strong> hr@pransquare.ai
                {/* <br />
                <strong>Phone:</strong> 123-555-HR (123-555-487) */}
              </span>
            ),
            sender: "bot",
          },
        ]);
        break;
      case "Timesheet Entry":
        setMessages((prev) => [
          ...prev,
          {
            text: "You're being redirected to the Timesheet entry page. Please wait...",
            sender: "bot",
          },
        ]);
        setTimeout(() => {
          navigate("/home/nems/timesheet");
        }, 1000);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option) => {
    if (option.subOptions) {
      // If there are sub-options, show them
      setIsSubOptions(true);
      setShowOptions(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Please select the option.", sender: "bot" },
      ]);
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: option.label, sender: "user" },
    ]);
    responseGenerators(option);
  };

  const handleSubOptionClick = async (subOption) => {
    // Add the user's selection to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: subOption.text, sender: "user" },
    ]);

    // Call the API to download the payslip
    if (subOption?.action?.type === "payroll") {
      try {
        const response = await DownloadOrViewPayslip({
          empBasicDetailId: employeeData?.employeeBasicDetailId,
          year: Number(subOption?.action?.data?.split("-")[0]?.trim()),
          month: getMonthIndex(subOption?.action?.data?.split("-")[1]?.trim()),
        });

        // Create a URL for the PDF blob and store it as a bot message
        const pdfUrl = window.URL.createObjectURL(new Blob([response]));
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Your ${subOption.text} payslip is ready. Click here to download.`,
            sender: "bot",
            pdfUrl, // Store the PDF URL here
            fileName: `${subOption.text} payslip.pdf`,
          },
        ]);
      } catch (err) {
        console.log(err);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, there was an error downloading the payslip.",
            sender: "bot",
          },
        ]);
      }
    } else if (subOption?.text === "Download more") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Redirecting to the payroll page...",
          sender: "bot",
        },
      ]);
      setTimeout(() => {
        navigate("/home/nems/payroll");
      }, 1000);
    }
  };

  const goToMainMenu = () => {
    setIsSubOptions(false);
    setShowOptions(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "You can choose from the following options:", sender: "bot" },
    ]);
  };

  const restartChat = () => {
    setMessages([
      {
        text: "Hi! I'm here to help. How can I assist you today?",
        sender: "bot",
      },
    ]);
    setShowOptions(true);
    setIsSubOptions(false);
  };

  // Scroll to the bottom of the chat messages when messages change or when the chat opens
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]); // Run every time messages change or chat opens

  useEffect(() => {
    const a = async () => {
      try {
        const req = await GetPayrollDetailsByEmployeeID(
          employeeData?.employeeBasicDetailId
        );
        setOptions((prev) =>
          prev.map((option) =>
            option.label === "payslip"
              ? {
                  ...option,
                  subOptions: req?.map((a) => ({
                    text: dayjs()
                      .month(getMonthIndex(a.payPeriodMonth))
                      .year(a.payPeriodYear)
                      .format("MMM, YYYY"),
                    action: {
                      type: "payroll",
                      data: a.payPeriodYear + "-" + a.payPeriodMonth,
                    },
                  })),
                }
              : option
          )
        );
      } catch (_error) {
        console.log(_error);
      }
    };
    a();
  }, [employeeData]);

  return (
    <div
      className="absolute right-5 bottom-5 "
      style={{
        zIndex: 9978979,
      }}
    >
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Badge
          badgeContent={
            <IconButton
              size="small"
              sx={{
                width: 20,
                height: 20,
                backgroundColor: "white",
                boxShadow: 1,
                ":hover": {
                  backgroundColor: "white",
                },
              }}
              onClick={minimizeClick}
              color="warning"
            >
              <Remove sx={{ fontSize: "1rem" }} />
            </IconButton>
          }
          overlap="circular"
        >
          <Fab
            color="warning"
            aria-label="chat"
            className="fixed bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsChatOpen(!isChatOpen)}
            sx={{
              zIndex: 0,
            }}
          >
            <Avatar
              src={botIcon} // Replace with the URL of your bot image
              sx={{ width: 40, height: 40, backgroundColor: "white" }} // Adjust the size as needed
            />
          </Fab>
        </Badge>
      )}

      {/* Chatbot Window */}
      {isChatOpen && (
        <ClickAwayListener onClickAway={() => setIsChatOpen(false)}>
          <div className="fixed bottom-16 right-4 top-20 w-80 bg-gray-400 shadow-lg rounded-lg h-min">
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: "#f36548",
                    }}
                  >
                    HR Genie
                  </Typography>
                  <IconButton onClick={restartChat} color="primary">
                    <RestartAltIcon />
                  </IconButton>
                </div>
                <div className="space-y-3 h-60 overflow-y-scroll bg-gray-100 p-4 rounded-md shadow-inner scrollbar-hidden">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        } max-w-xs`}
                      >
                        <Typography variant="body2">{msg.text}</Typography>
                        {/* PDF download link */}
                        {msg.pdfUrl && (
                          <Link
                            href={msg.pdfUrl}
                            download={msg.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: "primary.main",
                              display: "block",
                              marginTop: 1,
                            }}
                          >
                            Download Payslip
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Empty div to serve as a scroll target */}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="p-2 flex flex-wrap gap-2 h-max">
                {isSubOptions ? (
                  <>
                    {options
                      .find((option) => option.label === "payslip")
                      .subOptions.map((subOption, index) => (
                        <Chip
                          size="small"
                          key={index}
                          label={subOption.text}
                          onClick={() => handleSubOptionClick(subOption)}
                          color="primary"
                        />
                      ))}
                    <Chip
                      label={
                        <Typography variant="body2">Download more</Typography>
                      }
                      onClick={() =>
                        handleSubOptionClick({
                          text: "Download more",
                          action: {
                            type: "redirect",
                            data: "/home/nems/payroll",
                          },
                        })
                      }
                      size="small"
                      color="secondary"
                    />
                    <Chip
                      size="small"
                      label="Main Menu"
                      onClick={goToMainMenu}
                      color="success"
                    />
                  </>
                ) : (
                  showOptions &&
                  options.map((option, index) => (
                    <Chip
                      size="small"
                      key={index}
                      label={option.label}
                      onClick={() => handleOptionClick(option)}
                      color="primary"
                    />
                  ))
                )}
              </div>
            </Card>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}
Chatbot.propTypes = {
  minimizeClick: PropTypes.func.isRequired,
};

export default Chatbot;
