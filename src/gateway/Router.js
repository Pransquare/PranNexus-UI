// src/gateway/Router.js

import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Dashboard from "../components/Dashboard/Dashboard";
import HomePage from "../components/HomePage/HomePage";
import Requests from "../components/IT/Requests/Requests";
import LoginPage from "../components/Login/LoginPage";
import AppraisalForm from "../components/Pms/Group/AppraisalForm";
import PmsGroups from "../components/Pms/Group/PmsGroups";
import EmployeeSearch from "../components/details/EmployeeDetails/EmployeeSearch";
import NewsConfig from "../components/details/NewsConfig/NewsConfig";
import Payroll from "../components/ems/Payroll/Payroll";
import Leave from "../components/ems/leave/Leave";
import TimeSheet from "../components/ems/timesheet/TimeSheet";
import EmployeeApprovalConfig from "../components/hrConfig/EmployeeApprovalConfig/EmployeeApprovalConfig";
import EmployeeProject from "../components/hrConfig/EmployeeProjectConfig/EmployeeProject";
import GroupsSubGroups from "../components/hrConfig/Groups_SubGroupsConfig/GroupsSubGroups";
import DesignationMaster from "../components/master_config/DesignationMaster/DesignationMaster";
import LeaveType from "../components/master_config/LeaveType/LeaveType";
import ClientMaster from "../components/master_config/clientMaster/ClientMaster";
import DepartmentMaster from "../components/master_config/departmentMaster/DepartmentMaster";
import ProjectMaster from "../components/master_config/projectMaster/ProjectMaster";
import Candidate from "../components/smartHire/candidate/Candidate";
import CandidateList from "../components/smartHire/candidateList/CandidateList";
import ProtectedRoute from "./ProtectedRoute";
import ExpenseRecords from "../components/Finance/Expense/ExpenseRecords/ExpenseRecords";
import ExpenseSubmission from "../components/Finance/Expense/ExpenseSubmission/ExpenseSubmission";
import ContractManagement from "../components/ems/ContractManagement/ContractManagement";
import MyTaxDetails from "../components/ems/Tds/MyTaxDetails";
import TdsConfiguration from "../components/ems/Tds/TdsConfiguration";
import Reports from "../components/ems/reports/Reports";
import FinancialYearSetup from "../components/master_config/TaxSetup/FinancialYearSetup";
import ExpenseReport from "../components/ems/reports/ExpenseReport/ExpenseReport";
import Policies from "../components/Policies/Policies";
import AttComReport from "../components/ems/reports/AttComReport/AttComReport";
import RemitanceInvoice from "../components/Others/Invoices/RemittanceInvoices/RemitanceInvoice";
import VendorDetails from "../components/Finance/Vendor/VendorApproval/VendorDetails";
import VersionCheck from "../components/VersionUpdateUpload/VersionCheck";
import ReleaseNoteView from "../components/VersionUpdateUpload/ReleaseNoteView";
import SOWStatusNotifier from "../components/Others/Invoices/SowStatusNotifier/SOWStatusNotifier";
import VendorSeach from "../components/Finance/Vendor/VendorSearch/VendorSeach";
import GoalConfig from "../components/goal/GoalConfig";
import Holiday from "../components/Holidays/Holiday";
import Task from "../components/master_config/Task/Task";
import TimeSheetReportForManager from "../components/ems/timesheet/TimeSheetReportForManager";
import InitiateGoals from "../components/goal/InitiateGoals";
import EmployeeGoals from "../components/goal/EmployeeGoals";
import EmployeeTable from "../components/ems/Employees/EmployeeTable";
import HrOrManagerApproval from "../components/goal/HrOrManagerApproval";
import AttributeConfigForAppraisal from "../components/goal/AttributeConfigForAppraisal";
function Router() {
  return useRoutes([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <Navigate to="/home" />,
        },
        {
          path: "home",
          element: <HomePage />,
          children: [
            {
              path: "",
              element: <Dashboard />,
            },
            {
              path: "config",
              children: [
                {
                  path: "leaveType",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <LeaveType />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "designation",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <DesignationMaster />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "client",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <ClientMaster />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "project",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <ProjectMaster />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "task",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <Task />
                    </ProtectedRoute>
                  ),
                },

                {
                  path: "taxSetup",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <FinancialYearSetup />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "goal",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <GoalConfig />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "attribute",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <AttributeConfigForAppraisal />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "version",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <VersionCheck />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "department",
                  element: (
                    <ProtectedRoute roleName={["admin_configuration"]}>
                      <DepartmentMaster />
                    </ProtectedRoute>
                  ),
                },
                { path: "", element: <Navigate to="/home" /> },
              ],
            },
            {
              path: "tools/policies", // Policies added here
              element: (
                <ProtectedRoute roleName={["hr_tools"]}>
                  <Policies />
                </ProtectedRoute>
              ),
            },
            {
              path: "tools/holidays",
              element: (
                <ProtectedRoute roleName={["hr_tools"]}>
                  <Holiday />
                </ProtectedRoute>
              ),
            },
            {
              path: "ems",
              children: [
                {
                  path: "leave",
                  element: (
                    <ProtectedRoute roleName={["hr_tools_ems_leave"]}>
                      <Leave />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "timeSheet",
                  element: (
                    <ProtectedRoute roleName={["hr_tools_ems_timesheet"]}>
                      <TimeSheet />
                    </ProtectedRoute>
                  ),
                },
                // { path: "attendance-report", element: <ProtectedRoute roleName={["">
                // ]}  <Attendace />
                // </ProtectedRoute> },
                {
                  path: "payroll",
                  element: (
                    <ProtectedRoute roleName={["hr_tools_ems_payroll"]}>
                      <Payroll />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "releaseNoteSearch",
                  element: (
                    <ProtectedRoute roleName={["hr_tools_ems_payroll"]}>
                      <ReleaseNoteView />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "contractManagment",
                  element: (
                    // <ProtectedRoute roleName={["gm_ems_cmm"]}>
                    <ContractManagement />
                  ),
                  // </ProtectedRoute>
                },
                {
                  path: "appraisal",
                  children: [
                    { path: "initiateAppraisal", element: <PmsGroups /> },
                    { path: "employeeAppraisal", element: <AppraisalForm /> },
                  ],
                },
                {
                  path: "goals",
                  children: [
                    { path: "initiateGoals", element: <InitiateGoals /> },
                    {
                      path: "employeeGoals/:empBasicDetailId?",
                      element: <EmployeeGoals />,
                    },
                    {
                      path: "goalsApprove",
                      element: <HrOrManagerApproval />,
                    },
                  ],
                },
                {
                  path: "tds",
                  children: [
                    {
                      path: "tds_configuration",
                      element: <TdsConfiguration />,
                    },
                    { path: "tds_taxDetails", element: <MyTaxDetails /> },
                  ],
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "hr_config",
              children: [
                {
                  path: "employee_approver_config",
                  element: (
                    <ProtectedRoute roleName={["hr_config_employee_approvals"]}>
                      <EmployeeApprovalConfig />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "groups_subGroups_config",
                  element: (
                    <ProtectedRoute
                      roleName={["hr_config_employee_groups&subgroups"]}
                    >
                      <GroupsSubGroups />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "employee_project",
                  element: (
                    <ProtectedRoute roleName={["hr_config_employee_project"]}>
                      <EmployeeProject />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "news",
                  element: (
                    <ProtectedRoute roleName={["hr_config_news"]}>
                      <NewsConfig />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "details",
              children: [
                {
                  path: "employee_details",
                  element: (
                    <ProtectedRoute roleName={["hr_details_employee_details"]}>
                      <EmployeeSearch />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "employee_status/:status",
                  element: (
                    <ProtectedRoute roleName={["hr_details_employee_details"]}>
                      <EmployeeTable /> {/* Not using a wrapper */}
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "smartHire",
              children: [
                {
                  path: "candidateList",
                  element: (
                    <ProtectedRoute
                      roleName={["hr_tools_smartHire_candidateList"]}
                    >
                      <CandidateList />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "candidate/:candidateId?",
                  element: (
                    <ProtectedRoute
                      roleName={[
                        "hr_tools_smartHire_candidateList_View",
                        "hr_tools_smartHire_candidateList_Edit",
                        "hr_tools_smartHire_candidate_approval_budgetApproval",
                        "hr_tools_smartHire_candidate_approval_managementApproval",
                      ]}
                    >
                      <Candidate />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "candidate",
                  element: (
                    <ProtectedRoute roleName={["hr_tools_smartHire_candidate"]}>
                      <Candidate />
                    </ProtectedRoute>
                  ), // Default path for creating a new candidate
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "it",
              children: [
                {
                  path: "requests",
                  element: (
                    <ProtectedRoute roleName={["it_tools_onboarding_requests"]}>
                      <Requests />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "reports",
              children: [
                {
                  path: "project_report",
                  element: (
                    <ProtectedRoute roleName={["project_report"]}>
                      <Reports />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "expense_report",
                  element: (
                    <ProtectedRoute roleName={["expense_report"]}>
                      <ExpenseReport />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "timesheet_report_for_manager/:type?",
                  element: (
                    <ProtectedRoute roleName={["timesheet_report_for_manager"]}>
                      <TimeSheetReportForManager />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "attendance_compliance_report/:type?",
                  element: (
                    <ProtectedRoute roleName={["attendance_compliance_report"]}>
                      <AttComReport />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "finance",
              children: [
                {
                  path: "expense",
                  children: [
                    {
                      path: "submission/:id?",
                      element: (
                        <ProtectedRoute roleName={["finance_expense_new"]}>
                          <ExpenseSubmission />
                        </ProtectedRoute>
                      ),
                    },
                    {
                      path: "records",
                      element: (
                        <ProtectedRoute roleName={["finance_expense_list"]}>
                          <ExpenseRecords />
                        </ProtectedRoute>
                      ),
                    },
                    {
                      path: "",
                      element: <Navigate to="/home" />,
                    },
                  ],
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
                {
                  path: "vendorConfig",
                  element: (
                    <ProtectedRoute roleName={["vendor_config"]}>
                      <VendorDetails />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "vendorDetails",
                  element: (
                    <ProtectedRoute roleName={["vendor_view"]}>
                      <VendorSeach />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "invoices",
              children: [
                {
                  path: "remitance_invoice/:id?",
                  element: <RemitanceInvoice />,
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "invoices",
              children: [
                {
                  path: "sow_notifier/:id?",
                  element: <SOWStatusNotifier />,
                },
                {
                  path: "",
                  element: <Navigate to="/home" />,
                },
              ],
            },
            {
              path: "",
              element: <Navigate to="/home" />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);
}

export default Router;
