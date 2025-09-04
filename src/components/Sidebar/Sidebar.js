import {
  KeyboardArrowDownSharp,
  KeyboardArrowRightSharp,
} from "@mui/icons-material";
import {
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import {
  FaBook,
  FaClipboardList,
  FaCog,
  FaFileContract,
  FaIdBadge,
  FaLaptopCode,
  FaMoneyBillWave,
  FaTools,
  FaUser,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa"; // Import necessary icons
import { Link } from "react-router-dom";
import { UserManagentContext } from "../../customHooks/dataProviders/UserManagementProvider";
import "./Sidebar.css";
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";

const UserManagentCheck = (roleName, userManagementData) => {
  if (userManagementData) {
    return userManagementData?.roleNames?.some((data) => data === roleName);
  }
};


const Sidebar = ({ open = true, oncloseSideBar }) => {
  const [openSection, setOpenSection] = useState(null);
  const [openSubsection, setOpenSubsection] = useState(null);
  const [openInternalSubsection, setInternalSubsection] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { userManagementData } = useContext(UserManagentContext);
  const { employeeData } = useContext(EmployeeDataContext);
  const userManagentRes = useMemo(
    () => ({
      admin: UserManagentCheck("admin", userManagementData),
      admin_configuration: UserManagentCheck(
        "admin_configuration",
        userManagementData
      ),
      hr: UserManagentCheck("hr", userManagementData),
      hr_tools: UserManagentCheck("hr_tools", userManagementData),
      hr_tools_ems: UserManagentCheck("hr_tools_ems", userManagementData),
      hr_config_employee_groups_subgroups: UserManagentCheck(
        "hr_config_employee_groups&subgroups",
        userManagementData
      ),
      hr_tools_tax_approved_Details: UserManagentCheck(
        "hr_tools_tax_approved_Details",
        userManagementData
      ),
      hr_tools_ems_leave: UserManagentCheck(
        "hr_tools_ems_leave",
        userManagementData
      ),
      hr_tools_ems_timesheet: UserManagentCheck(
        "hr_tools_ems_timesheet",
        userManagementData
      ),
      hr_tools_Tax_Deatails: UserManagentCheck(
        "hr_tools_Tax_Deatails",
        userManagementData
      ),
      hr_tools_Contract_Management: UserManagentCheck(
        "hr_tools_Contract_Management",
        userManagementData
      ),
      hr_tools_ems_payroll: UserManagentCheck(
        "hr_tools_ems_payroll",
        userManagementData
      ),
      admin_Tax_configuration: UserManagentCheck(
        "admin_Tax_configuration",
        userManagementData
      ),
      hr_tools_ems_appraisal: UserManagentCheck(
        "hr_tools_ems_appraisal",
        userManagementData
      ),
      hr_tools_ems_appraisal_initiate: UserManagentCheck(
        "hr_tools_ems_appraisal_initiate",
        userManagementData
      ),
      hr_tools_ems_appraisal_form: UserManagentCheck(
        "hr_tools_ems_appraisal_form",
        userManagementData
      ),
      hr_tools_nexusHire: UserManagentCheck(
        "hr_tools_nexusHire",
        userManagementData
      ),
      Hr_goal_initiate: UserManagentCheck(
        "Hr_goal_initiate",
        userManagementData
      ),
      emp_goal_view: UserManagentCheck("emp_goal_view", userManagementData),
      goal_approval: UserManagentCheck("goal_approval", userManagementData),
      hr_config: UserManagentCheck("hr_config", userManagementData),
      hr_config_employee_project: UserManagentCheck(
        "hr_config_employee_project",
        userManagementData
      ),
      hr_config_employee_approvals: UserManagentCheck(
        "hr_config_employee_approvals",
        userManagementData
      ),
      tds_employee: UserManagentCheck("tds_employee", userManagementData),
      hr_config_news: UserManagentCheck("hr_config_news", userManagementData),
      hr_details: UserManagentCheck("hr_details", userManagementData),
      hr_details_employee_details: UserManagentCheck(
        "hr_details_employee_details",
        userManagementData
      ),
      it: UserManagentCheck("it", userManagementData),
      it_tools: UserManagentCheck("it_tools", userManagementData),
      it_tools_onboarding_requests: UserManagentCheck(
        "it_tools_onboarding_requests",
        userManagementData
      ),
      finance: UserManagentCheck("finance", userManagementData),
      hr_tools_nexusHire_candidateList: UserManagentCheck(
        "hr_tools_nexusHire_candidateList",
        userManagementData
      ),
      hr_tools_nexusHire_candidate: UserManagentCheck(
        "hr_tools_nexusHire_candidate",
        userManagementData
      ),
      hr_tools_ems_timesheet_project_report: UserManagentCheck(
        "hr_tools_ems_timesheet_project_report",
        userManagementData
      ),
      gm_ems_cmm: UserManagentCheck("gm_ems_cmm", userManagementData),
      sgm_ems_cmm: UserManagentCheck("sgm_ems_cmm", userManagementData),
      reports: UserManagentCheck("reports", userManagementData),
      project_report: UserManagentCheck("project_report", userManagementData),
      finance_expense: UserManagentCheck("finance_expense", userManagementData),
      sow_leaderShip_cmm: UserManagentCheck(
        "sow_leaderShip_cmm",
        userManagementData
      ),
      sow_finance_cmm: UserManagentCheck("sow_finance_cmm", userManagementData),
      mgt_ems_cmm: UserManagentCheck("mgt_ems_cmm", userManagementData),
      finance_expense_list: UserManagentCheck(
        "finance_expense_list",
        userManagementData
      ),
      finance_expense_new: UserManagentCheck(
        "finance_expense_new",
        userManagementData
      ),
      expense_report: UserManagentCheck("expense_report", userManagementData),
      attendance_compliance_report: UserManagentCheck(
        "attendance_compliance_report",
        userManagementData
      ),
      timesheet_effort_report: UserManagentCheck(
        "timesheet_effort_report",
        userManagementData
      ),
      timesheet_report_for_manager: UserManagentCheck(
        "timesheet_report_for_manager",
        userManagementData
      ),
      email_extraction: UserManagentCheck(
        "email_extraction",
        userManagementData
      ),
      vendor_config: UserManagentCheck("vendor_config", userManagementData),
      vendor_approval: UserManagentCheck("vendor_approval", userManagementData),
    }),
    [userManagementData]
  );

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
    setOpenSubsection(null);
  };

  const toggleSubsection = (index) => {
    setOpenSubsection(openSubsection === index ? null : index);
    setInternalSubsection(null);
  };

  return (
    <Drawer
      open={open}
      onClose={oncloseSideBar}
      PaperProps={{
        style: {
          backgroundColor: "#412276",
          borderRight: "1px solid #e0e0e0",
          boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className="h-full sidebar text-white">
        <List disablePadding={true}>
          {userManagentRes["admin"] && (
            <>
              <ListItemButton divider={true} onClick={() => toggleSection(3)}>
                <FaUser className="text-white" />
                <ListItemText
                  sx={{
                    marginLeft: "0.5rem",
                  }}
                  primary="Admin"
                />
                {openSection === 3 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>
              <Collapse in={openSection === 3} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  {userManagentRes["admin_configuration"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      onClick={() => toggleSubsection(4)}
                    >
                      <FaCog className="text-white" />
                      <ListItemText
                        sx={{
                          marginLeft: "0.5rem",
                        }}
                        primary="Configuration"
                      />
                      {openSubsection === 4 ? (
                        <KeyboardArrowDownSharp />
                      ) : (
                        <KeyboardArrowRightSharp />
                      )}
                    </ListItemButton>
                  )}
                  <Collapse
                    in={openSubsection === 4}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding={true}>
                      <ListItemButton
                        dense
                        divider={true}
                        onClick={() =>
                          setInternalSubsection(
                            openInternalSubsection ? null : 1
                          )
                        }
                      >
                        <FaBook className="text-white" />
                        <ListItemText
                          sx={{
                            marginLeft: "0.5rem",
                          }}
                          primary="Masters"
                        />
                        {openInternalSubsection === 1 ? (
                          <KeyboardArrowDownSharp />
                        ) : (
                          <KeyboardArrowRightSharp />
                        )}
                      </ListItemButton>
                      <Collapse
                        in={openInternalSubsection === 1}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding={true}>
                          <ListItemButton
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            dense
                            to="config/leaveType"
                          >
                            <ListItemText primary="Leave Type" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="config/designation"
                          >
                            <ListItemText primary="Designation" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="config/client"
                          >
                            <ListItemText primary="Client" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="config/project"
                          >
                            <ListItemText primary="Project" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="config/goal"
                          >
                            <ListItemText primary="Goals Configuration" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="config/attribute"
                          >
                            <ListItemText primary="Attribute Configuration" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="config/task"
                          >
                            <ListItemText primary="Tasks" />
                          </ListItemButton>

                          {userManagentRes["admin_Tax_configuration"] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="config/taxSetup"
                            >
                              <ListItemText primary="Tax Setup Hub" />
                            </ListItemButton>
                          )}

                          {/* <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                                                      onClick={oncloseSideBar}

                          to="config/department"
                        >
                          <ListItemText primary="Department" />
                        </ListItemButton> */}
                        </List>
                      </Collapse>
                      <ListItemButton
                        dense
                        divider={true}
                        component={Link}
                        onClick={oncloseSideBar}
                        to="config/version"
                      >
                        <ListItemText primary="Upload Release Notes" />
                      </ListItemButton>
                      {/* <ListItemButton
                      divider={true}
                      dense
                      onClick={() =>
                        setInternalSubsection(openInternalSubsection ? null : 2)
                      }
                    >
                      <FaUsersCog className="text-white" />
                      <ListItemText
                        sx={{
                          marginLeft: "0.5rem",
                        }}
                        primary="Roles and Groups"
                      />
                      {openInternalSubsection === 2 ? (
                        <KeyboardArrowDownSharp />
                      ) : (
                        <KeyboardArrowRightSharp />
                      )}
                    </ListItemButton> */}
                      <Collapse
                        in={openInternalSubsection === 2}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding={true}>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="rolesConfig/roleType"
                          >
                            <ListItemText primary="Role Types" />
                          </ListItemButton>
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="rolesConfig/roleNames"
                          >
                            <ListItemText primary="Role Names" />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </List>
                  </Collapse>
                </List>
              </Collapse>
            </>
          )}
          {userManagentRes["hr"] && (
            <>
              <ListItemButton
                divider={true}
                onClick={() => toggleSection(0)}
                selected={openSection === 0}
              >
                <FaUsers className="text-white" />
                <ListItemText
                  primary="HR"
                  className="ml-6"
                  sx={{
                    marginLeft: "0.5rem",
                  }}
                />
                {openSection === 0 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>
              <Collapse in={openSection === 0} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  {userManagentRes["hr_tools"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      onClick={() => toggleSubsection(0)}
                      selected={openSubsection === 0}
                    >
                      <FaTools className="text-white" />
                      <ListItemText
                        sx={{
                          marginLeft: "0.5rem",
                        }}
                        primary="Tools"
                      />
                      {openSubsection === 0 ? (
                        <KeyboardArrowDownSharp />
                      ) : (
                        <KeyboardArrowRightSharp />
                      )}
                    </ListItemButton>
                  )}
                  <Collapse
                    in={openSubsection === 0}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding={true}>
                      {userManagentRes["hr_tools_ems"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          onClick={() =>
                            setHoveredItem(hoveredItem ? null : "ems")
                          }
                          selected={hoveredItem === "ems"}
                        >
                          <FaIdBadge className="text-white" />
                          <ListItemText
                            sx={{
                              marginLeft: "0.5rem",
                            }}
                            primary="EMS"
                          />
                          {hoveredItem === "ems" ? (
                            <KeyboardArrowDownSharp />
                          ) : (
                            <KeyboardArrowRightSharp />
                          )}
                        </ListItemButton>
                      )}
                      <Collapse
                        in={hoveredItem === "ems"}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding={true}>
                          {userManagentRes["hr_tools_ems_leave"] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="ems/leave"
                            >
                              <ListItemText primary="Leave" />
                            </ListItemButton>
                          )}
                          {userManagentRes["hr_tools_ems_timesheet"] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="ems/timesheet"
                            >
                              <ListItemText primary="Timesheet" />
                            </ListItemButton>
                          )}
                          {userManagentRes["hr_tools_ems_payroll"] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="ems/payroll"
                            >
                              <ListItemText primary="Payroll" />
                            </ListItemButton>
                          )}

                          {userManagentRes["hr_tools_ems_payroll"] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="ems/tds/tds_taxDetails"
                            >
                              <ListItemText primary="Tax Details Management" />
                            </ListItemButton>
                          )}

                          {userManagentRes["hr_tools_ems_appraisal"] && (
                            <>
                              <ListItemButton
                                dense
                                divider={true}
                                onClick={() =>
                                  setInternalSubsection(
                                    openInternalSubsection === 6 ? null : 6
                                  )
                                }
                              >
                                <ListItemText primary="Goals" />
                                {openInternalSubsection === 6 ? (
                                  <KeyboardArrowDownSharp />
                                ) : (
                                  <KeyboardArrowRightSharp />
                                )}
                              </ListItemButton>

                              <Collapse
                                in={openInternalSubsection === 6}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding={true}>
                                  {userManagentRes["Hr_goal_initiate"] && (
                                    <ListItemButton
                                      dense
                                      divider={true}
                                      component={Link}
                                      onClick={oncloseSideBar}
                                      to="ems/goals/initiateGoals"
                                    >
                                      <ListItemText primary="Initiate Goals" />
                                    </ListItemButton>
                                  )}
                                  {userManagentRes["emp_goal_view"] && (
                                    <ListItemButton
                                      dense
                                      divider={true}
                                      component={Link}
                                      onClick={oncloseSideBar}
                                      to="ems/goals/employeeGoals"
                                    >
                                      <ListItemText primary="Goals Settings" />
                                    </ListItemButton>
                                  )}
                                  {userManagentRes["goal_approval"] && (
                                    <ListItemButton
                                      dense
                                      divider={true}
                                      component={Link}
                                      onClick={oncloseSideBar}
                                      to="ems/goals/goalsApprove"
                                    >
                                      <ListItemText primary="Goals Approvals" />
                                    </ListItemButton>
                                  )}
                                </List>
                              </Collapse>
                            </>
                          )}

                          {userManagentRes["hr_tools_ems_appraisal"] && (
                            <>
                              <ListItemButton
                                dense
                                divider={true}
                                onClick={() =>
                                  setInternalSubsection(
                                    openInternalSubsection === 5 ? null : 5
                                  )
                                }
                              >
                                <ListItemText primary="Appraisal" />
                                {openInternalSubsection === 5 ? (
                                  <KeyboardArrowDownSharp />
                                ) : (
                                  <KeyboardArrowRightSharp />
                                )}
                              </ListItemButton>
                              <Collapse
                                in={openInternalSubsection === 5}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding={true}>
                                  {userManagentRes[
                                    "hr_tools_ems_appraisal_initiate"
                                  ] && (
                                    <ListItemButton
                                      dense
                                      divider={true}
                                      component={Link}
                                      onClick={oncloseSideBar}
                                      to="ems/appraisal/initiateAppraisal"
                                    >
                                      <ListItemText primary="Initiate Appraisal" />
                                    </ListItemButton>
                                  )}

                                  {userManagentRes[
                                    "hr_tools_ems_appraisal_form"
                                  ] &&
                                    !employeeData?.genericProfile && (
                                      <ListItemButton
                                        dense
                                        divider={true}
                                        component={Link}
                                        onClick={oncloseSideBar}
                                        to="ems/appraisal/employeeAppraisal"
                                      >
                                        <ListItemText primary="Employee Appraisal" />
                                      </ListItemButton>
                                    )}
                                </List>
                              </Collapse>
                            </>
                          )}
                        </List>
                      </Collapse>
                      {userManagentRes["hr_tools_nexusHire"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          onClick={() =>
                            setHoveredItem(hoveredItem ? null : "nexusHire")
                          }
                          selected={hoveredItem === "nexusHire"}
                        >
                          <FaIdBadge className="text-white" />
                          <ListItemText
                            sx={{
                              marginLeft: "0.5rem",
                            }}
                            primary="Nexus Hire"
                          />
                          {hoveredItem === "nexusHire" ? (
                            <KeyboardArrowDownSharp />
                          ) : (
                            <KeyboardArrowRightSharp />
                          )}
                        </ListItemButton>
                      )}
                      <Collapse
                        in={hoveredItem === "nexusHire"}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding={true}>
                          {userManagentRes["hr_tools_nexusHire_candidate"] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="nexusHire/candidate"
                            >
                              <ListItemText primary="Candidate" />
                            </ListItemButton>
                          )}
                          {userManagentRes[
                            "hr_tools_nexusHire_candidateList"
                          ] && (
                            <ListItemButton
                              dense
                              divider={true}
                              component={Link}
                              onClick={oncloseSideBar}
                              to="nexusHire/candidateList"
                            >
                              <ListItemText primary="Candidate List" />
                            </ListItemButton>
                          )}
                        </List>
                      </Collapse>
                      {userManagentRes["hr_tools"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="tools/policies"
                        >
                          <FaFileAlt className="text-white" />
                          <ListItemText
                            sx={{
                              marginLeft: "0.5rem",
                            }}
                            primary="Policies"
                          />
                        </ListItemButton>
                      )}
                      {userManagentRes["hr_tools"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="tools/holidays"
                        >
                          <FaFileAlt className="text-white" />
                          <ListItemText
                            sx={{
                              marginLeft: "0.5rem",
                            }}
                            primary="Holidays"
                          />
                        </ListItemButton>
                      )}
                    </List>
                  </Collapse>
                  {userManagentRes["hr_config"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      onClick={() => toggleSubsection(3)}
                      selected={openSubsection === 0}
                    >
                      <FaCog className="text-white" />
                      <ListItemText
                        sx={{
                          marginLeft: "0.5rem",
                        }}
                        primary="Configuration"
                      />
                      {openSubsection === 3 ? (
                        <KeyboardArrowDownSharp />
                      ) : (
                        <KeyboardArrowRightSharp />
                      )}
                    </ListItemButton>
                  )}
                  <Collapse
                    in={openSubsection === 3}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding={true}>
                      {userManagentRes["hr_config_employee_project"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="hr_config/employee_project"
                        >
                          <ListItemText primary="Employee Project" />
                        </ListItemButton>
                      )}
                      {userManagentRes["hr_config_employee_approvals"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="hr_config/employee_approver_config"
                        >
                          <ListItemText primary="Employee Approvals" />
                        </ListItemButton>
                      )}
                      {/* {userManagentRes["tds_employee"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="ems/tds/tds_configuration"
                        >
                          <ListItemText primary="TDS" />
                        </ListItemButton>
                      )} */}
                      {userManagentRes[
                        "hr_config_employee_groups_subgroups"
                      ] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="hr_config/groups_subGroups_config"
                        >
                          <ListItemText primary="Groups & Sub Groups" />
                        </ListItemButton>
                      )}
                      {userManagentRes["hr_config_news"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="hr_config/news"
                        >
                          <ListItemText primary="News" />
                        </ListItemButton>
                      )}
                    </List>
                  </Collapse>
                  {userManagentRes["hr_details"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      onClick={() => toggleSubsection(5)}
                      selected={openSubsection === 0}
                    >
                      <FaUser className="text-white" />
                      <ListItemText
                        sx={{
                          marginLeft: "0.5rem",
                        }}
                        primary="Details"
                      />
                      {openSubsection === 5 ? (
                        <KeyboardArrowDownSharp />
                      ) : (
                        <KeyboardArrowRightSharp />
                      )}
                    </ListItemButton>
                  )}
                  <Collapse
                    in={openSubsection === 5}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding={true}>
                      {userManagentRes["hr_details_employee_details"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="details/employee_details"
                        >
                          <ListItemText primary="Employee Details" />
                        </ListItemButton>
                      )}
                    </List>
                  </Collapse>
                </List>
              </Collapse>
            </>
          )}

          {userManagentRes["it"] && (
            <>
              <ListItemButton divider={true} onClick={() => toggleSection(1)}>
                <FaLaptopCode className="text-white" />

                <ListItemText
                  sx={{
                    marginLeft: "0.5rem",
                  }}
                  primary="IT"
                />
                {openSection === 1 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>
              <Collapse in={openSection === 1} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  {userManagentRes["it_tools"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      onClick={() => toggleSubsection(1)}
                    >
                      <FaTools className="text-white" />
                      <ListItemText
                        sx={{
                          marginLeft: "0.5rem",
                        }}
                        primary="Tools"
                      />
                      {openSubsection === 1 ? (
                        <KeyboardArrowDownSharp />
                      ) : (
                        <KeyboardArrowRightSharp />
                      )}
                    </ListItemButton>
                  )}
                  <Collapse
                    in={openSubsection === 1}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding={true}>
                      {userManagentRes["it_tools_onboarding_requests"] && (
                        <ListItemButton
                          dense
                          divider={true}
                          component={Link}
                          onClick={oncloseSideBar}
                          to="it/requests"
                        >
                          <ListItemText primary="Requests" />
                        </ListItemButton>
                      )}
                    </List>
                  </Collapse>
                </List>
              </Collapse>
            </>
          )}

          {userManagentRes["finance"] &&
            ((!userManagentRes["hr_details"] && !userManagentRes["it"]) ||
              userManagentRes["admin"]) && (
              <>
                <ListItemButton divider={true} onClick={() => toggleSection(2)}>
                  <FaMoneyBillWave className="text-white" />
                  <ListItemText
                    sx={{
                      marginLeft: "0.5rem",
                    }}
                    primary="Finance"
                  />
                  {openSection === 2 ? (
                    <KeyboardArrowDownSharp />
                  ) : (
                    <KeyboardArrowRightSharp />
                  )}
                </ListItemButton>

                <Collapse in={openSection === 2} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding={true}>
                    {userManagentRes["finance_expense"] && (
                      <ListItemButton
                        dense
                        divider={true}
                        onClick={() => toggleSubsection(2)}
                      >
                        <FaTools className="text-white" />
                        <ListItemText
                          sx={{
                            marginLeft: "0.5rem",
                          }}
                          primary="Expenses"
                        />
                        {openSubsection === 2 ? (
                          <KeyboardArrowDownSharp />
                        ) : (
                          <KeyboardArrowRightSharp />
                        )}
                      </ListItemButton>
                    )}

                    <Collapse
                      in={openSubsection === 2}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding={true}>
                        {userManagentRes["finance_expense_new"] && (
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="finance/expense/submission"
                          >
                            <ListItemText primary="Submission" />
                          </ListItemButton>
                        )}
                        {userManagentRes["finance_expense_list"] && (
                          <ListItemButton
                            dense
                            divider={true}
                            component={Link}
                            onClick={oncloseSideBar}
                            to="finance/expense/records"
                          >
                            <ListItemText primary="Records" />
                          </ListItemButton>
                        )}
                      </List>
                    </Collapse>
                  </List>
                </Collapse>
              </>
            )}

          {userManagentRes["reports"] && (
            <>
              <ListItemButton divider={true} onClick={() => toggleSection(4)}>
                <FaClipboardList className="text-white" />

                <ListItemText
                  sx={{
                    marginLeft: "0.5rem",
                  }}
                  primary="Reports"
                />
                {openSection === 4 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>
              <Collapse in={openSection === 4} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  {userManagentRes["project_report"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      component={Link}
                      onClick={oncloseSideBar}
                      to="reports/project_report"
                    >
                      <ListItemText primary="Project Report" />
                    </ListItemButton>
                  )}
                  {userManagentRes["expense_report"] &&
                    (!userManagentRes["hr_details"] ||
                      userManagentRes["admin"]) && (
                      <ListItemButton
                        dense
                        divider={true}
                        component={Link}
                        onClick={oncloseSideBar}
                        to="reports/expense_report"
                      >
                        <ListItemText primary="Expense Report" />
                      </ListItemButton>
                    )}
                  {userManagentRes["attendance_compliance_report"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      component={Link}
                      onClick={oncloseSideBar}
                      to="reports/attendance_compliance_report/compliance"
                    >
                      <ListItemText primary="Attendance Compliance Report" />
                    </ListItemButton>
                  )}
                  {userManagentRes["timesheet_effort_report"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      component={Link}
                      onClick={oncloseSideBar}
                      to="reports/attendance_compliance_report/effort"
                    >
                      <ListItemText primary="Timesheet Effort Report" />
                    </ListItemButton>
                  )}
                  {userManagentRes["timesheet_report_for_manager"] && (
                    <ListItemButton
                      dense
                      divider={true}
                      component={Link}
                      onClick={oncloseSideBar}
                      to="reports/timesheet_report_for_manager/effort"
                    >
                      <ListItemText primary="Timesheet Report" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </>
          )}
          {/* {(userManagentRes["gm_ems_cmm"] ||
            userManagentRes["sgm_ems_cmm"] ||
            userManagentRes["sow_finance_cmm"] ||
            userManagentRes["sow_leaderShip_cmm"] ||
            userManagentRes["mgt_ems_cmm"]) && (
            <>
              <ListItemButton
                divider={true}
                onClick={() => toggleSection(6)}
                selected={openSection === 6}
              >
                <FaFileContract className="text-white" />
                <ListItemText
                  primary="Contract Management"
                  sx={{
                    marginLeft: "0.5rem",
                  }}
                />
                {openSection === 6 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>
              <Collapse in={openSection === 6} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  <ListItemButton
                    dense
                    divider={true}
                    component={Link}
                    onClick={oncloseSideBar}
                    to="ems/contractManagment"
                  >
                    <ListItemText primary="SOW" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )} */}

          {userManagentRes["email_extraction"] && (
            <>
              <ListItemButton divider={true} onClick={() => toggleSection(7)}>
                <FaClipboardList className="text-white" />

                <ListItemText
                  sx={{
                    marginLeft: "0.5rem",
                  }}
                  primary="Emails Extraction"
                />
                {openSection === 7 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>
              <Collapse in={openSection === 7} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  <ListItemButton
                    dense
                    divider={true}
                    component={Link}
                    onClick={oncloseSideBar}
                    to="invoices/remitance_invoice/invoice"
                  >
                    <ListItemText primary="Invoice Extraction" />
                  </ListItemButton>
                  <ListItemButton
                    dense
                    divider={true}
                    component={Link}
                    onClick={oncloseSideBar}
                    to="invoices/remitance_invoice/reports"
                  >
                    <ListItemText primary="Reports" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}
          {(userManagentRes["vendor_config"] ||
            userManagentRes["vendor_approval"]) && (
            <>
              <ListItemButton divider={true} onClick={() => toggleSection(5)}>
                <FaUser className="text-white" />
                <ListItemText sx={{ marginLeft: "0.5rem" }} primary="Vendor" />
                {openSection === 5 ? (
                  <KeyboardArrowDownSharp />
                ) : (
                  <KeyboardArrowRightSharp />
                )}
              </ListItemButton>

              <Collapse in={openSection === 5} timeout="auto" unmountOnExit>
                <List component="div" disablePadding={true}>
                  <ListItemButton
                    dense
                    divider={true}
                    component={Link}
                    onClick={oncloseSideBar}
                    to="finance/vendorConfig"
                  >
                    <ListItemText primary="Vendor Onboarding & Approval" />
                  </ListItemButton>

                  <ListItemButton
                    dense
                    divider={true}
                    component={Link}
                    onClick={oncloseSideBar}
                    to="finance/vendorDetails"
                  >
                    <ListItemText primary="Vendor Details" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}
          <>
            {userManagentRes["hr_tools_ems_payroll"] && (
              <ListItemButton
                dense
                divider={true}
                component={Link}
                onClick={oncloseSideBar}
                to="ems/releaseNoteSearch"
              >
                <ListItemText primary="Release Note" />
              </ListItemButton>
            )}
          </>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
