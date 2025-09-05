import { Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import candidate from "../../../src/assets/Images/candidate.png";
import timesheet from "../../../src/assets/Images/timesheet.png";
import { UserManagentCheck } from "../../common/UserManagement";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { GetAllDesignations } from "../../service/api/DesinationService";
import {
  GetEmployeeLeaveByApproverId,
  GetEmployeeLeaveConfigDetails,
} from "../../service/api/nemsService/EmployeeLeaveService";
import {
  GetAllByEmpId,
  GetBirthdayList,
  GetEmployeeCounts,
} from "../../service/api/nemsService/EmployeeService";
import { GetAllNews } from "../../service/api/nemsService/NewsService";
import { DownloadResponseFile } from "../../service/api/nemsService/Payroll";
import { RemoveBillUrl, UploadExpense } from "../../service/api/ExpenseService";
import { GetAllHolidays } from "../../service/api/HolidayService";
import { GetAllWorkLocation } from "../../service/api/hrConfig/hrConfig";
import ManagerDetailsModal from "../ManagerDetailsModal/ManagerDetailsModal";
import ProfilePic from "../ProfilePic/ProfilePic";
import "./Dashbord.css";
import { approverConfigMasterData } from "../hrConfig/EmployeeApprovalConfig/ApprovalConfig";

// Component definition
function Dashboard() {
  const { user } = useOutletContext();
  const { employeeData, setEmployeeData } = useContext(EmployeeDataContext);
  const [designationsData, setDesignationsData] = useState(null);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [leaveApproval, setLeaveApproval] = useState(null);
  const [holidayList, setholidayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [designation, setDesignation] = useState(null);
  const [news, setNews] = useState([]);
  const [workLocationData, setWorkLocationData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [birthdayList, setBirthdayList] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [employeeCounts, setEmployeeCounts] = useState({
    activeCount: 0,
    inactiveCount: 0,
  });
  const navigate = useNavigate();

  // Other variables and user permissions
  // const candidateList = UserManagentCheck("hr_tools_smartHire_candidateList");
  const candidateList = UserManagentCheck("hr_tools_NexusHire_candidateList");
  // const hr = UserManagentCheck(
  //   "hr_tools_smartHire_candidate_approval_uploadOfferLetter"
  // );
  const hr = UserManagentCheck("hr_tools_NexusHire_candidate_approval_uploadOfferLetter");
  // const budget = UserManagentCheck(
  //   "hr_tools_smartHire_candidate_approval_budgetApproval"
  // );
  const budget = UserManagentCheck("hr_tools_NexusHire_candidate_approval_budgetApproval");
  // const management = UserManagentCheck(
  //   "hr_tools_smartHire_candidate_approval_managementApproval"
  // );
  const management = UserManagentCheck("hr_tools_NexusHire_candidate_approval_managementApproval");

  // const leaveApprover = UserManagentCheck("hr_tools_ems_leave_leaveApproval");
const leaveApprover = UserManagentCheck("hr_tools_nems_leave_leaveApproval");
  const genericUser = employeeData?.genericProfile;

  // Navigating to different pages
  const handleTimesheetNavigate = () => {
    navigate("/home/nems/timesheet");
  };

  const handleCandidateNavigate = () => {
    navigate("/home/NexusHire/candidateList");
  };

  const handleLeaveApprovalsNavigate = () => {
    navigate("/home/nems/leave");
  };

  const handleHolidayNavigate = () => {
    navigate("/home/tools/holidays");
  };

  const handleActiveEmployeesNavigate = () => {
    navigate('/home/details/employee_status/active');
  };

  const handleInactiveEmployeesNavigate = () => {
    navigate('/home/details/employee_status/inactive');
  };

  const getNextHoliday = (holidays) => {
    const todayDate = dayjs().startOf("day");
    const upcomingHolidays = holidays
      .filter(
        (holiday) =>
          dayjs(holiday.holidayDate).isSame(todayDate) ||
          dayjs(holiday.holidayDate).isAfter(todayDate)
      )
      .sort((a, b) => dayjs(a.holidayDate).diff(dayjs(b.holidayDate)));
    return upcomingHolidays[0];
  };

  const handleOpenModal = (type) => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // useEffect hook for fetching initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // Fetch necessary data
        const designationsResult = await GetAllDesignations();
        if (designationsResult) {
          setDesignationsData(designationsResult);
        }

        const workLocationResult = await GetAllWorkLocation();
        if (workLocationResult) {
          console.log("Work location", workLocationResult);
        }

        const employeeDetails = await GetAllByEmpId({
          employeeBasicDetailId: employeeData?.employeeBasicDetailId,
        });

        function formatModuleName(name) {
          return name
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }

        const formattedTableData = employeeDetails.map((detail) => {
          const { moduleName, approverEntity } = detail;
          const approverName = approverEntity
            ? `${approverEntity.firstName} ${approverEntity.lastName}`
            : "N/A";

          return {
            moduleName: approverConfigMasterData.find(
              (a) => a.moduleCode === moduleName
            )?.module,
            approverName,
          };
        });

        setTableData(formattedTableData);

        if (employeeData) {
          const employeeDesignationCode = employeeData?.designation;
          const designationDescription =
            designationsResult.find(
              (des) => des.designationCode === employeeDesignationCode
            )?.designationDescription || "Not Available";
          setDesignation(designationDescription);
        }

        if (employeeData) {
          const employeeWorkLocationCode = employeeData?.workLocationCode;
          const employeeWorkLocation =
            workLocationResult.find(
              (work) => work.workLocationCode === employeeWorkLocationCode
            )?.workLocation || "Not Available";
          setWorkLocationData(employeeWorkLocation);
        }

        const leaveResult = await GetEmployeeLeaveConfigDetails({
          employeeId: employeeData?.employeeBasicDetailId,
        });
        let leaveData = {
          leaveBalance: 0,
          leaveTakenThisYear: 0,
          pendingLeaveRequests: 0,
        };
        for (const leave of leaveResult) {
          leaveData.leaveBalance += Math.abs(leave.remaining);
          leaveData.leaveTakenThisYear += Math.abs(leave.used);
          leaveData.pendingLeaveRequests += Math.abs(leave.pending);
        }
        setLeaveDetails(leaveData);

        const birthdaysResult = await GetBirthdayList();

        const sortedBirthdayList = birthdaysResult.sort((a, b) => {
          const currentYear = new Date().getFullYear(); // Get the current year

          // Create Date objects that use the current year to ignore the year when sorting
          const dateA = new Date(a.dob);
          const dateB = new Date(b.dob);

          // Set both dates to the current year to ignore year during comparison
          dateA.setFullYear(currentYear);
          dateB.setFullYear(currentYear);

          return dateA - dateB; // Sort by the resulting date
        });

        // Set the sorted list to the state
        setBirthdayList(sortedBirthdayList);

        const holidaysResult = await GetAllHolidays({
          workLocation: employeeData?.workLocationCode,
        });
        const nextHoliday = getNextHoliday(holidaysResult);
        if (nextHoliday) {
          setholidayList([nextHoliday]);
        } else {
          setholidayList([]);
        }

        const newsResult = await GetAllNews();
        setNews(newsResult);

        const leaveApprovalResult = await GetEmployeeLeaveByApproverId(
          employeeData?.employeeBasicDetailId
        );
        setLeaveApproval(leaveApprovalResult); // Store leave data in state

        const employeeCounts = await GetEmployeeCounts();
        setEmployeeCounts(employeeCounts); // Store employee counts in state

        setLoading(false); // Set loading to false after all data is fetched
      } catch (error) {
        console.log(error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    const fetchProfilePic = async () => {
      if (employeeData?.profilePicPath) {
        try {
          // Fetch image using the path from employee data
          const imagePath = employeeData?.profilePicPath;
          const imageBlob = await DownloadResponseFile(imagePath); // Call the API to fetch image

          // Create a URL for the image blob and update state
          const imageURL = URL.createObjectURL(imageBlob);
          setProfilePic(imageURL);
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };

    if (employeeData) {
      fetchProfilePic(); // Fetch profile picture if employeeData exists
    }

    fetchData(); // Fetch the rest of the data
  }, [employeeData]); // Re-run the effect if employeeData changes

  const handleImageSelect = async (file) => {
    // Create FormData to send the image to the backend
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    const type = "profilePic";

    try {
      const response = await UploadExpense(
        formData,
        employeeData?.employeeCode,
        type
      );
      if (response?.imageUrl) {
        setProfilePic(response.imageUrl); // Update profile pic after successful upload
      } else {
        console.error("Error uploading profile picture");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await RemoveBillUrl(employeeData?.employeeCode);
      if (response) {
        setProfilePic(null);
      } else {
        console.error("Error removing profile picture");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container p-1">
      <div className="grid-container grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div>
          <div
  className="card-large text-white relative"
  style={{ backgroundColor: "rgb(77,208,225)" }}
>

            <div className="employee-heading">
              <Typography variant="h4" className="primary">
                {employeeData?.workType === "permanent"
                  ? "Employee / Associate Details"
                  : "Contract Employee / Associate Details"}
              </Typography>
            </div>
            <div className="employee-card">
              <div className="employee">
                <div className="mt-4">
                  {employeeData ? (
                    <div className="employee-details">
                      {!genericUser && (
                        <div className="detail-item">
                          <Typography variant="h5" className="label">
                            Employee Code: {employeeData?.employeeCode}
                          </Typography>
                        </div>
                      )}

                      <div className="detail-item">
                        <Typography variant="h5" className="label">
                          Name: {employeeData?.fullName}
                        </Typography>
                      </div>

                      <div className="detail-item">
                        <Typography variant="h5" className="label">
                          Email: {employeeData?.emailId}
                        </Typography>
                      </div>
                      {!genericUser && (
                        <div className="detail-item">
                          <Typography variant="h5" className="label">
                            Designation: {designation}
                          </Typography>
                        </div>
                      )}
                      {!genericUser && (
                        <div className="detail-item">
                          <Typography variant="h5" className="label">
                            Work Location: {workLocationData}
                          </Typography>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Typography variant="body1">
                      Loading employee data...
                    </Typography>
                  )}
                </div>

                {!genericUser && (
                  <div className="button-container mt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenModal}
                    >
                      Manager Details
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile Picture inside the large card */}
              <div className="profile">
                <ProfilePic
                  profilePic={profilePic}
                  setProfilePic={setProfilePic}
                  onImageSelect={handleImageSelect}
                  onRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
          </div>

          {hr && (
            <div className="employee-count grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Active Employees Card */}
              <div className="card-tall bg-white p-4 rounded-lg shadow-md  quick-link-2"
              onClick={handleActiveEmployeesNavigate}>
                <div className="quick-link-content flex flex-col items-center text-center">
                  <Typography variant="h4" className="secondary">
                    Active Employees
                  </Typography>
                  {/* Show Active Employee Count */}
                  <Typography variant="h3" className="tertiary mt-2">
                    {employeeCounts.activeCount}
                  </Typography>
                </div>
              </div>

              {/* Inactive Employees Card */}
              <div className="card-tall bg-white p-4 rounded-lg shadow-md quick-link-2"
              onClick={handleInactiveEmployeesNavigate}>
                <div className="quick-link-content flex flex-col items-center text-center">
                  <Typography variant="h4" className="secondary">
                    Inactive Employees
                  </Typography>
                  {/* Show Inactive Employee Count */}
                  <Typography variant="h3" className="tertiary mt-2">
                    {employeeCounts.inactiveCount}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Leave Details - only for permanent employees */}
          {employeeData?.workType === "permanent" &&
            leaveDetails &&
            !genericUser && (
              <div
                className="card-medium bg-white shadow-lg rounded-xl mt-4 quick-link-2"
                onClick={handleLeaveApprovalsNavigate}
              >
                <Typography variant="h4" className="secondary">
                  Leave Details
                </Typography>
                <div className="leave-details-container">
                  <div className="column-item">
                    <Typography variant="h5" className="secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" className="number">
                      {leaveDetails.leaveBalance}
                    </Typography>
                  </div>
                  <div className="vertical-divider"></div>
                  <div className="column-item">
                    <Typography variant="h5" className="secondary">
                      Used
                    </Typography>
                    <Typography variant="h6" className="number">
                      {leaveDetails.leaveTakenThisYear}
                    </Typography>
                  </div>
                  <div className="vertical-divider"></div>
                  <div className="column-item">
                    <Typography variant="h5" className="secondary">
                      Pending
                    </Typography>
                    <Typography variant="h6" className="number">
                      {leaveDetails.pendingLeaveRequests}
                    </Typography>
                  </div>
                </div>
              </div>
            )}

          {/* Next Holiday - only for permanent employees */}
          {employeeData?.workType === "permanent" && (
            <div
              className="card-small bg-white shadow-lg rounded-xl mt-4 quick-link-2"
              onClick={handleHolidayNavigate}
            >
              <Typography variant="h4" className="secondary">
                Upcoming Holidays
              </Typography>
              {holidayList?.length > 0 ? (
                <>
                  <Typography variant="h6" className="tertiary">
                    {holidayList[0].holidayDescription}
                  </Typography>
                  <Typography variant="body1" className="tertiary">
                    {dayjs(holidayList[0].holidayDate).format("DD MMMM")}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" className="tertiary">
                  No upcoming holidays
                </Typography>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Quick Links - Both Cards Stack on Small Screens */}
          {candidateList ? (
            genericUser ? (
              // Case: Generic user and candidate list is true
              <div className="quick-links-row grid grid-cols-1 gap-4">
                <div
                  className="card-tall quick-link"
                  onClick={handleCandidateNavigate}
                >
                  <div className="quick-link-content">
                    <div className="quick-link-text">
                      <Typography variant="h4" className="secondary">
                        {hr
                          ? "Candidate List"
                          : budget || management
                          ? "Candidate Approval"
                          : ""}
                      </Typography>
                    </div>
                    <img
                      src={candidate}
                      alt="Candidate Icon"
                      className="image-class"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Case: Not a generic user but candidate list is true
              <div className="quick-links-row grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Timesheet card hidden for genericUser */}
                {!genericUser && (
                  <div
                    className="card-small quick-link"
                    onClick={handleTimesheetNavigate}
                  >
                    <div className="quick-link-content">
                      <div className="quick-link-text">
                        <Typography variant="h4" className="secondary">
                          Timesheet
                        </Typography>
                      </div>
                      <img
                        src={timesheet}
                        alt="Timesheet Icon"
                        className="image-class"
                      />
                    </div>
                  </div>
                )}
                <div
                  className="card-small quick-link"
                  onClick={handleCandidateNavigate}
                >
                  <div className="quick-link-content">
                    <div className="quick-link-text">
                      <Typography variant="h4" className="secondary">
                        {hr
                          ? "Candidate List"
                          : budget || management
                          ? "Candidate Approval"
                          : ""}
                      </Typography>
                    </div>
                    <img
                      src={candidate}
                      alt="Candidate Icon"
                      className="image-class"
                    />
                  </div>
                </div>
              </div>
            )
          ) : (
            // Case: Candidate list is false
            // Hide the "Timesheet" card for genericUser here as well
            !genericUser && (
              <div
                className="card-tall quick-link"
                onClick={handleTimesheetNavigate}
              >
                <div className="quick-link-content">
                  <div className="quick-link-text">
                    <Typography variant="h4" className="secondary">
                      Timesheet
                    </Typography>
                  </div>
                  <img
                    src={timesheet}
                    alt="Timesheet Icon"
                    className="image-class"
                  />
                </div>
              </div>
            )
          )}

          <div>
            {leaveApprover && !employeeData?.genericProfile && (
              <div
                className="card-wide bg-white shadow-lg rounded-lg mt-4 p-6 quick-link-2"
                onClick={handleLeaveApprovalsNavigate}
              >
                <>
                  <Typography variant="h4" className="secondary text-lg">
                    Leave Approvals
                  </Typography>

                  <div className="leave-list">
                    {/* Enable scroll but hide scrollbar */}
                    {leaveApproval.length > 0 ? (
                      leaveApproval.map((leave, index) => (
                        <div
                          className="leave-item border-b py-4 flex justify-between items-center"
                          key={leave.id || index} // Changed from birthday.id to leave.id
                        >
                          <Typography
                            variant="h6"
                            className="text-gray-700 font-medium text-sm"
                          >
                            {leave.employeeName}
                          </Typography>
                          <Typography
                            variant="h6"
                            className="text-gray-700 font-medium text-sm"
                          >
                            {dayjs(leave.leaveFrom).format("D/M/YYYY")} -{" "}
                            {dayjs(leave.leaveTo).format("D/M/YYYY")}
                          </Typography>
                        </div>
                      ))
                    ) : (
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        No leave requests pending for approval.
                      </Typography>
                    )}
                  </div>
                </>
              </div>
            )}
          </div>

          {employeeData?.workType === "permanent" && (
            <div className="card-wide bg-white shadow-lg rounded-lg mt-4 p-6">
              <Typography variant="h4" className="secondary text-lg">
                Birthday List
              </Typography>

              <div className="birthday-list max-h-56 overflow-y-auto mt-2 min-h-0">
                {/* Enable scroll but hide scrollbar */}
                {birthdayList.length > 0 ? (
                  birthdayList.map((birthday, index) => (
                    <div
                      className="birthday-item border-b py-4 flex justify-between items-center"
                      key={index}
                    >
                      <Typography
                        variant="h6"
                        className="text-gray-700 font-medium text-sm" // Reduced font size here
                      >
                        {birthday.firstName} {birthday.lastName}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="text-gray-700 font-medium text-sm pr-5" // Reduced font size here
                      >
                        {dayjs(birthday.dob).format("MMMM D")}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body1" className="text-gray-500 text-sm">
                    No birthdays coming next week.
                  </Typography>
                )}
              </div>
            </div>
          )}

          {employeeData?.workType === "permanent" && (
            <div className="card-wide news-section bg-white shadow-lg rounded-xl mt-4">
              <Typography variant="h4" className="secondary">
                Company News
              </Typography>

              <div className="news-list h-56 overflow-y-auto mt-2">
                {" "}
                {/* Set fixed height and scroll */}
                {news.length > 0 ? (
                  news.map((item, index) => (
                    <div className="news-item border-b py-1" key={index}>
                      {" "}
                      {/* Separator */}
                      <Typography variant="body1">{item.news}</Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body1" className="tertiary">
                    No news available
                  </Typography>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manager Details Modal */}
      <ManagerDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        tableData={tableData}
        workType={employeeData?.workType}
      />
    </div>
  );
}

export default Dashboard;
