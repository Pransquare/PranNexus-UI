// // src/gateway/Router.js

// import React from "react";
// import { Navigate, useRoutes } from "react-router-dom";
// import Dashboard from "../components/Dashboard/Dashboard";
// import HomePage from "../components/HomePage/HomePage";
// import Requests from "../components/IT/Requests/Requests";
// import LoginPage from "../components/Login/LoginPage";
// import AppraisalForm from "../components/Pms/Group/AppraisalForm";
// import PmsGroups from "../components/Pms/Group/PmsGroups";
// import EmployeeSearch from "../components/details/EmployeeDetails/EmployeeSearch";
// import NewsConfig from "../components/details/NewsConfig/NewsConfig";
// import Payroll from "../components/nems/Payroll/Payroll";
// import Leave from "../components/nems/leave/Leave";
// import TimeSheet from "../components/nems/timesheet/TimeSheet";
// import EmployeeApprovalConfig from "../components/hrConfig/EmployeeApprovalConfig/EmployeeApprovalConfig";
// import EmployeeProject from "../components/hrConfig/EmployeeProjectConfig/EmployeeProject";
// import GroupsSubGroups from "../components/hrConfig/Groups_SubGroupsConfig/GroupsSubGroups";
// import DesignationMaster from "../components/master_config/DesignationMaster/DesignationMaster";
// import LeaveType from "../components/master_config/LeaveType/LeaveType";
// import ClientMaster from "../components/master_config/clientMaster/ClientMaster";
// import DepartmentMaster from "../components/master_config/departmentMaster/DepartmentMaster";
// import ProjectMaster from "../components/master_config/projectMaster/ProjectMaster";

// import Candidate from "../components/NexusHire/candidate/Candidate";
// import CandidateList from "../components/NexusHire/candidateList/CandidateList";
// import ProtectedRoute from "./ProtectedRoute";
// import ExpenseRecords from "../components/Finance/Expense/ExpenseRecords/ExpenseRecords";
// import ExpenseSubmission from "../components/Finance/Expense/ExpenseSubmission/ExpenseSubmission";
// import ContractManagement from "../components/nems/ContractManagement/ContractManagement";
// import MyTaxDetails from "../components/nems/Tds/MyTaxDetails";
// import TdsConfiguration from "../components/nems/Tds/TdsConfiguration";
// import Reports from "../components/nems/reports/Reports";
// import FinancialYearSetup from "../components/master_config/TaxSetup/FinancialYearSetup";
// import ExpenseReport from "../components/nems/reports/ExpenseReport/ExpenseReport";
// import Policies from "../components/Policies/Policies";
// import AttComReport from "../components/nems/reports/AttComReport/AttComReport";
// import RemitanceInvoice from "../components/Others/Invoices/RemittanceInvoices/RemitanceInvoice";
// import VendorDetails from "../components/Finance/Vendor/VendorApproval/VendorDetails";
// import VersionCheck from "../components/VersionUpdateUpload/VersionCheck";
// import ReleaseNoteView from "../components/VersionUpdateUpload/ReleaseNoteView";
// import SOWStatusNotifier from "../components/Others/Invoices/SowStatusNotifier/SOWStatusNotifier";
// import VendorSeach from "../components/Finance/Vendor/VendorSearch/VendorSeach";
// import GoalConfig from "../components/goal/GoalConfig";
// import Holiday from "../components/Holidays/Holiday";
// import Task from "../components/master_config/Task/Task";
// import TimeSheetReportForManager from "../components/nems/timesheet/TimeSheetReportForManager";
// import InitiateGoals from "../components/goal/InitiateGoals";
// import EmployeeGoals from "../components/goal/EmployeeGoals";
// import EmployeeTable from "../components/nems/Employees/EmployeeTable";
// import HrOrManagerApproval from "../components/goal/HrOrManagerApproval";
// import AttributeConfigForAppraisal from "../components/goal/AttributeConfigForAppraisal";
// function Router() {
//   return useRoutes([
//     {
//       path: "/",
//       element: <ProtectedRoute />,
//       children: [
//         {
//           path: "",
//           element: <Navigate to="/home" />,
//         },
//         {
//           path: "home",
//           element: <HomePage />,
//           children: [
//             {
//               path: "",
//               element: <Dashboard />,
//             },
//             {
//               path: "config",
//               children: [
//                 {
//                   path: "leaveType",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <LeaveType />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "designation",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <DesignationMaster />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "client",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <ClientMaster />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "project",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <ProjectMaster />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "task",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <Task />
//                     </ProtectedRoute>
//                   ),
//                 },

//                 {
//                   path: "taxSetup",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <FinancialYearSetup />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "goal",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <GoalConfig />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "attribute",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <AttributeConfigForAppraisal />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "version",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <VersionCheck />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "department",
//                   element: (
//                     <ProtectedRoute roleName={["admin_configuration"]}>
//                       <DepartmentMaster />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 { path: "", element: <Navigate to="/home" /> },
//               ],
//             },
//             {
//               path: "tools/policies", // Policies added here
//               element: (
//                 <ProtectedRoute roleName={["hr_tools"]}>
//                   <Policies />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "tools/holidays",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools"]}>
//                   <Holiday />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "nems",
//               children: [
//                 {
//                   path: "leave",
//                   element: (
//                     <ProtectedRoute roleName={["hr_tools_nems_leave"]}>
//                       <Leave />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "timeSheet",
//                   element: (
//                     <ProtectedRoute roleName={["hr_tools_nems_timesheet"]}>
//                       <TimeSheet />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 // { path: "attendance-report", element: <ProtectedRoute roleName={["">
//                 // ]}  <Attendace />
//                 // </ProtectedRoute> },
//                 {
//                   path: "payroll",
//                   element: (
//                     <ProtectedRoute roleName={["hr_tools_nems_payroll"]}>
//                       <Payroll />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "releaseNoteSearch",
//                   element: (
//                     <ProtectedRoute roleName={["hr_tools_nems_payroll"]}>
//                       <ReleaseNoteView />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "contractManagment",
//                   element: (
//                     // <ProtectedRoute roleName={["gm_nems_cmm"]}>
//                     <ContractManagement />
//                   ),
//                   // </ProtectedRoute>
//                 },
//                 {
//                   path: "appraisal",
//                   children: [
//                     { path: "initiateAppraisal", element: <PmsGroups /> },
//                     { path: "employeeAppraisal", element: <AppraisalForm /> },
//                   ],
//                 },
//                 {
//                   path: "goals",
//                   children: [
//                     { path: "initiateGoals", element: <InitiateGoals /> },
//                     {
//                       path: "employeeGoals/:empBasicDetailId?",
//                       element: <EmployeeGoals />,
//                     },
//                     {
//                       path: "goalsApprove",
//                       element: <HrOrManagerApproval />,
//                     },
//                   ],
//                 },
//                 {
//                   path: "tds",
//                   children: [
//                     {
//                       path: "tds_configuration",
//                       element: <TdsConfiguration />,
//                     },
//                     { path: "tds_taxDetails", element: <MyTaxDetails /> },
//                   ],
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "hr_config",
//               children: [
//                 {
//                   path: "employee_approver_config",
//                   element: (
//                     <ProtectedRoute roleName={["hr_config_employee_approvals"]}>
//                       <EmployeeApprovalConfig />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "groups_subGroups_config",
//                   element: (
//                     <ProtectedRoute
//                       roleName={["hr_config_employee_groups&subgroups"]}
//                     >
//                       <GroupsSubGroups />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "employee_project",
//                   element: (
//                     <ProtectedRoute roleName={["hr_config_employee_project"]}>
//                       <EmployeeProject />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "news",
//                   element: (
//                     <ProtectedRoute roleName={["hr_config_news"]}>
//                       <NewsConfig />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "details",
//               children: [
//                 {
//                   path: "employee_details",
//                   element: (
//                     <ProtectedRoute roleName={["hr_details_employee_details"]}>
//                       <EmployeeSearch />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "employee_status/:status",
//                   element: (
//                     <ProtectedRoute roleName={["hr_details_employee_details"]}>
//                       <EmployeeTable /> {/* Not using a wrapper */}
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "NexusHire",
//               children: [
//                 {
//                   path: "candidateList",
//                   element: (
//                     <ProtectedRoute
//                       roleName={["hr_tools_NexusHire_candidateList"]}
//                     >
//                       <CandidateList />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "candidate/:candidateId?",
//                   element: (
//                     <ProtectedRoute
//                       roleName={[
//                         "hr_tools_NexusHire_candidateList_View",
//                         "hr_tools_NexusHire_candidateList_Edit",
//                         "hr_tools_NexusHire_candidate_approval_budgetApproval",
//                         "hr_tools_NexusHire_candidate_approval_managementApproval",
//                       ]}
//                     >
//                       <Candidate />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "candidate",
//                   element: (
//                     <ProtectedRoute roleName={["hr_tools_NexusHire_candidate"]}>
//                       <Candidate />
//                     </ProtectedRoute>
//                   ), // Default path for creating a new candidate
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "it",
//               children: [
//                 {
//                   path: "requests",
//                   element: (
//                     <ProtectedRoute roleName={["it_tools_onboarding_requests"]}>
//                       <Requests />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "reports",
//               children: [
//                 {
//                   path: "project_report",
//                   element: (
//                     <ProtectedRoute roleName={["project_report"]}>
//                       <Reports />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "expense_report",
//                   element: (
//                     <ProtectedRoute roleName={["expense_report"]}>
//                       <ExpenseReport />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "timesheet_report_for_manager/:type?",
//                   element: (
//                     <ProtectedRoute roleName={["timesheet_report_for_manager"]}>
//                       <TimeSheetReportForManager />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "attendance_compliance_report/:type?",
//                   element: (
//                     <ProtectedRoute roleName={["attendance_compliance_report"]}>
//                       <AttComReport />
//                     </ProtectedRoute>
//                   ),
//                 },
//               ],
//             },
//             {
//               path: "finance",
//               children: [
//                 {
//                   path: "expense",
//                   children: [
//                     {
//                       path: "submission/:id?",
//                       element: (
//                         <ProtectedRoute roleName={["finance_expense_new"]}>
//                           <ExpenseSubmission />
//                         </ProtectedRoute>
//                       ),
//                     },
//                     {
//                       path: "records",
//                       element: (
//                         <ProtectedRoute roleName={["finance_expense_list"]}>
//                           <ExpenseRecords />
//                         </ProtectedRoute>
//                       ),
//                     },
//                     {
//                       path: "",
//                       element: <Navigate to="/home" />,
//                     },
//                   ],
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//                 {
//                   path: "vendorConfig",
//                   element: (
//                     <ProtectedRoute roleName={["vendor_config"]}>
//                       <VendorDetails />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "vendorDetails",
//                   element: (
//                     <ProtectedRoute roleName={["vendor_view"]}>
//                       <VendorSeach />
//                     </ProtectedRoute>
//                   ),
//                 },
//               ],
//             },
//             {
//               path: "invoices",
//               children: [
//                 {
//                   path: "remitance_invoice/:id?",
//                   element: <RemitanceInvoice />,
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "invoices",
//               children: [
//                 {
//                   path: "sow_notifier/:id?",
//                   element: <SOWStatusNotifier />,
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       path: "/login",
//       element: <LoginPage />,
//     },
//   ]);
// }

// export default Router;


















//src/gateway/Router.js

// import React from "react";
// import { Navigate, useRoutes } from "react-router-dom";
// import Dashboard from "../components/Dashboard/Dashboard";
// import HomePage from "../components/HomePage/HomePage";
// import Requests from "../components/IT/Requests/Requests";
// import LoginPage from "../components/Login/LoginPage";
// import AppraisalForm from "../components/Pms/Group/AppraisalForm";
// import PmsGroups from "../components/Pms/Group/PmsGroups";
// import EmployeeSearch from "../components/details/EmployeeDetails/EmployeeSearch";
// import NewsConfig from "../components/details/NewsConfig/NewsConfig";
// import Payroll from "../components/nems/Payroll/Payroll";
// import Leave from "../components/nems/leave/Leave";
// import TimeSheet from "../components/nems/timesheet/TimeSheet";
// import EmployeeApprovalConfig from "../components/hrConfig/EmployeeApprovalConfig/EmployeeApprovalConfig";
// import EmployeeProject from "../components/hrConfig/EmployeeProjectConfig/EmployeeProject";
// import GroupsSubGroups from "../components/hrConfig/Groups_SubGroupsConfig/GroupsSubGroups";
// import DesignationMaster from "../components/master_config/DesignationMaster/DesignationMaster";
// import LeaveType from "../components/master_config/LeaveType/LeaveType";
// import ClientMaster from "../components/master_config/clientMaster/ClientMaster";
// import DepartmentMaster from "../components/master_config/departmentMaster/DepartmentMaster";
// import ProjectMaster from "../components/master_config/projectMaster/ProjectMaster";

// import Candidate from "../components/NexusHire/candidate/Candidate";
// import CandidateList from "../components/NexusHire/candidateList/CandidateList";
// import ProtectedRoute from "./ProtectedRoute";
// import ExpenseRecords from "../components/Finance/Expense/ExpenseRecords/ExpenseRecords";
// import ExpenseSubmission from "../components/Finance/Expense/ExpenseSubmission/ExpenseSubmission";
// import ContractManagement from "../components/nems/ContractManagement/ContractManagement";
// import MyTaxDetails from "../components/nems/Tds/MyTaxDetails";
// import TdsConfiguration from "../components/nems/Tds/TdsConfiguration";
// import Reports from "../components/nems/reports/Reports";
// import FinancialYearSetup from "../components/master_config/TaxSetup/FinancialYearSetup";
// import ExpenseReport from "../components/nems/reports/ExpenseReport/ExpenseReport";
// import Policies from "../components/Policies/Policies";
// import AttComReport from "../components/nems/reports/AttComReport/AttComReport";
// import RemitanceInvoice from "../components/Others/Invoices/RemittanceInvoices/RemitanceInvoice";
// import VendorDetails from "../components/Finance/Vendor/VendorApproval/VendorDetails";
// import VersionCheck from "../components/VersionUpdateUpload/VersionCheck";
// import ReleaseNoteView from "../components/VersionUpdateUpload/ReleaseNoteView";
// import SOWStatusNotifier from "../components/Others/Invoices/SowStatusNotifier/SOWStatusNotifier";
// import VendorSeach from "../components/Finance/Vendor/VendorSearch/VendorSeach";
// import GoalConfig from "../components/goal/GoalConfig";
// import Holiday from "../components/Holidays/Holiday";
// import Task from "../components/master_config/Task/Task";
// import TimeSheetReportForManager from "../components/nems/timesheet/TimeSheetReportForManager";
// import InitiateGoals from "../components/goal/InitiateGoals";
// import EmployeeGoals from "../components/goal/EmployeeGoals";
// import EmployeeTable from "../components/nems/Employees/EmployeeTable";
// import HrOrManagerApproval from "../components/goal/HrOrManagerApproval";
// import AttributeConfigForAppraisal from "../components/goal/AttributeConfigForAppraisal";

// function Router() {
//   return useRoutes([
//     {
//       path: "/",
//       // 🔴 CHANGED: instead of going directly to /home, go to /login
//       element: <Navigate to="/login" />,
//     },
//     {
//       path: "/login",
//       element: <LoginPage />,
//     },
//     {
//       path: "/home",
//       element: (
//         <ProtectedRoute>
//           <HomePage />
//         </ProtectedRoute>
//       ),
//       children: [
//         {
//           path: "",
//           element: <Dashboard />,
//         },
//         {
//           path: "config",
//           children: [
//             {
//               path: "leaveType",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <LeaveType />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "designation",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <DesignationMaster />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "client",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <ClientMaster />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "project",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <ProjectMaster />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "task",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <Task />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "taxSetup",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <FinancialYearSetup />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "goal",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <GoalConfig />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "attribute",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <AttributeConfigForAppraisal />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "version",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <VersionCheck />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "department",
//               element: (
//                 <ProtectedRoute roleName={["admin_configuration"]}>
//                   <DepartmentMaster />
//                 </ProtectedRoute>
//               ),
//             },
//             { path: "", element: <Navigate to="/home" /> },
//           ],
//         },
//         {
//           path: "tools/policies",
//           element: (
//             <ProtectedRoute roleName={["hr_tools"]}>
//               <Policies />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "tools/holidays",
//           element: (
//             <ProtectedRoute roleName={["hr_tools"]}>
//               <Holiday />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "nems",
//           children: [
//             {
//               path: "leave",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools_nems_leave"]}>
//                   <Leave />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "timeSheet",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools_nems_timesheet"]}>
//                   <TimeSheet />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "payroll",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools_nems_payroll"]}>
//                   <Payroll />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "releaseNoteSearch",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools_nems_payroll"]}>
//                   <ReleaseNoteView />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "contractManagment",
//               element: <ContractManagement />,
//             },
//             {
//               path: "appraisal",
//               children: [
//                 { path: "initiateAppraisal", element: <PmsGroups /> },
//                 { path: "employeeAppraisal", element: <AppraisalForm /> },
//               ],
//             },
//             {
//               path: "goals",
//               children: [
//                 { path: "initiateGoals", element: <InitiateGoals /> },
//                 {
//                   path: "employeeGoals/:empBasicDetailId?",
//                   element: <EmployeeGoals />,
//                 },
//                 {
//                   path: "goalsApprove",
//                   element: <HrOrManagerApproval />,
//                 },
//               ],
//             },
//             {
//               path: "tds",
//               children: [
//                 {
//                   path: "tds_configuration",
//                   element: <TdsConfiguration />,
//                 },
//                 { path: "tds_taxDetails", element: <MyTaxDetails /> },
//               ],
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "hr_config",
//           children: [
//             {
//               path: "employee_approver_config",
//               element: (
//                 <ProtectedRoute roleName={["hr_config_employee_approvals"]}>
//                   <EmployeeApprovalConfig />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "groups_subGroups_config",
//               element: (
//                 <ProtectedRoute roleName={["hr_config_employee_groups&subgroups"]}>
//                   <GroupsSubGroups />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "employee_project",
//               element: (
//                 <ProtectedRoute roleName={["hr_config_employee_project"]}>
//                   <EmployeeProject />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "news",
//               element: (
//                 <ProtectedRoute roleName={["hr_config_news"]}>
//                   <NewsConfig />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "details",
//           children: [
//             {
//               path: "employee_details",
//               element: (
//                 <ProtectedRoute roleName={["hr_details_employee_details"]}>
//                   <EmployeeSearch />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "employee_status/:status",
//               element: (
//                 <ProtectedRoute roleName={["hr_details_employee_details"]}>
//                   <EmployeeTable />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "nexusHire",
//           children: [
//             {
//               path: "candidateList",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools_nexusHire_candidateList"]}>
//                   <CandidateList />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "candidate/:candidateId?",
//               element: (
//                 <ProtectedRoute
//                   roleName={[
//                     "hr_tools_nexusHire_candidateList_View",
//                     "hr_tools_nexusHire_candidateList_Edit",
//                     "hr_tools_nexusHire_candidate_approval_budgetApproval",
//                     "hr_tools_nexusHire_candidate_approval_managementApproval",
//                   ]}
//                 >
//                   <Candidate />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "candidate",
//               element: (
//                 <ProtectedRoute roleName={["hr_tools_nexusHire_candidate"]}>
//                   <Candidate />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "it",
//           children: [
//             {
//               path: "requests",
//               element: (
//                 <ProtectedRoute roleName={["it_tools_onboarding_requests"]}>
//                   <Requests />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "reports",
//           children: [
//             {
//               path: "project_report",
//               element: (
//                 <ProtectedRoute roleName={["project_report"]}>
//                   <Reports />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "expense_report",
//               element: (
//                 <ProtectedRoute roleName={["expense_report"]}>
//                   <ExpenseReport />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "timesheet_report_for_manager/:type?",
//               element: (
//                 <ProtectedRoute roleName={["timesheet_report_for_manager"]}>
//                   <TimeSheetReportForManager />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "attendance_compliance_report/:type?",
//               element: (
//                 <ProtectedRoute roleName={["attendance_compliance_report"]}>
//                   <AttComReport />
//                 </ProtectedRoute>
//               ),
//             },
//           ],
//         },
//         {
//           path: "finance",
//           children: [
//             {
//               path: "expense",
//               children: [
//                 {
//                   path: "submission/:id?",
//                   element: (
//                     <ProtectedRoute roleName={["finance_expense_new"]}>
//                       <ExpenseSubmission />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "records",
//                   element: (
//                     <ProtectedRoute roleName={["finance_expense_list"]}>
//                       <ExpenseRecords />
//                     </ProtectedRoute>
//                   ),
//                 },
//                 {
//                   path: "",
//                   element: <Navigate to="/home" />,
//                 },
//               ],
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//             {
//               path: "vendorConfig",
//               element: (
//                 <ProtectedRoute roleName={["vendor_config"]}>
//                   <VendorDetails />
//                 </ProtectedRoute>
//               ),
//             },
//             {
//               path: "vendorDetails",
//               element: (
//                 <ProtectedRoute roleName={["vendor_view"]}>
//                   <VendorSeach />
//                 </ProtectedRoute>
//               ),
//             },
//           ],
//         },
//         {
//           path: "invoices",
//           children: [
//             {
//               path: "remitance_invoice/:id?",
//               element: <RemitanceInvoice />,
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "invoices",
//           children: [
//             {
//               path: "sow_notifier/:id?",
//               element: <SOWStatusNotifier />,
//             },
//             {
//               path: "",
//               element: <Navigate to="/home" />,
//             },
//           ],
//         },
//         {
//           path: "",
//           element: <Navigate to="/home" />,
//         },
//       ],
//     },
//   ]);
// }

// export default Router;




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
import Payroll from "../components/nems/Payroll/Payroll";
import Leave from "../components/nems/leave/Leave";
import TimeSheet from "../components/nems/timesheet/TimeSheet";
import EmployeeApprovalConfig from "../components/hrConfig/EmployeeApprovalConfig/EmployeeApprovalConfig";
import EmployeeProject from "../components/hrConfig/EmployeeProjectConfig/EmployeeProject";
import GroupsSubGroups from "../components/hrConfig/Groups_SubGroupsConfig/GroupsSubGroups";
import DesignationMaster from "../components/master_config/DesignationMaster/DesignationMaster";
import LeaveType from "../components/master_config/LeaveType/LeaveType";
import ClientMaster from "../components/master_config/clientMaster/ClientMaster";
import DepartmentMaster from "../components/master_config/departmentMaster/DepartmentMaster";
import ProjectMaster from "../components/master_config/projectMaster/ProjectMaster";
 
import Candidate from "../components/NexusHire/candidate/Candidate";
import CandidateList from "../components/NexusHire/candidateList/CandidateList";
import ProtectedRoute from "./ProtectedRoute";
import ExpenseRecords from "../components/Finance/Expense/ExpenseRecords/ExpenseRecords";
import ExpenseSubmission from "../components/Finance/Expense/ExpenseSubmission/ExpenseSubmission";
import ContractManagement from "../components/nems/ContractManagement/ContractManagement";
import MyTaxDetails from "../components/nems/Tds/MyTaxDetails";
import TdsConfiguration from "../components/nems/Tds/TdsConfiguration";
import Reports from "../components/nems/reports/Reports";
import FinancialYearSetup from "../components/master_config/TaxSetup/FinancialYearSetup";
import ExpenseReport from "../components/nems/reports/ExpenseReport/ExpenseReport";
import Policies from "../components/Policies/Policies";
import AttComReport from "../components/nems/reports/AttComReport/AttComReport";
import RemitanceInvoice from "../components/Others/Invoices/RemittanceInvoices/RemitanceInvoice";
import VendorDetails from "../components/Finance/Vendor/VendorApproval/VendorDetails";
import VersionCheck from "../components/VersionUpdateUpload/VersionCheck";
import ReleaseNoteView from "../components/VersionUpdateUpload/ReleaseNoteView";
import SOWStatusNotifier from "../components/Others/Invoices/SowStatusNotifier/SOWStatusNotifier";
import VendorSeach from "../components/Finance/Vendor/VendorSearch/VendorSeach";
import GoalConfig from "../components/goal/GoalConfig";
import Holiday from "../components/Holidays/Holiday";
import Task from "../components/master_config/Task/Task";
import TimeSheetReportForManager from "../components/nems/timesheet/TimeSheetReportForManager";
import InitiateGoals from "../components/goal/InitiateGoals";
import EmployeeGoals from "../components/goal/EmployeeGoals";
import EmployeeTable from "../components/nems/Employees/EmployeeTable";
import HrOrManagerApproval from "../components/goal/HrOrManagerApproval";
import AttributeConfigForAppraisal from "../components/goal/AttributeConfigForAppraisal";
 
function Router() {
  return useRoutes([
    {
      path: "/",
      // 🔴 CHANGED: instead of going directly to /home, go to /login
      element: <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
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
          path: "tools/policies",
          element: (
            <ProtectedRoute roleName={["hr_tools"]}>
              <Policies />
            </ProtectedRoute>
          ),
        },
        {
          path: "tools/holidays",
          element: (
            // roleName={["hr_tools"]}
            <ProtectedRoute >
              <Holiday />
            </ProtectedRoute>
          ),
        },
        {
          path: "nems",
          children: [
            {
              path: "leave",
              element: (
                <ProtectedRoute roleName={["hr_tools_nems_leave", "hr_tools_nems_leave_leaveApproval","it" ,"finance","hr_tools"]}>
                  <Leave />
                </ProtectedRoute>
              ),
            },
            {
              path: "timeSheet",
              element: (
                <ProtectedRoute roleName={["hr_tools_nems_timesheet", "hr_tools_nems_timesheet_Approvals","it","finance","hr_tools"]}>
                  <TimeSheet />
                </ProtectedRoute>
              ),
            },
            {
              path: "payroll",
              element: (
                <ProtectedRoute roleName={["hr_tools_nems_payroll"]}>
                  <Payroll />
                </ProtectedRoute>
              ),
            },
            {
              path: "releaseNoteSearch",
              element: (
                <ProtectedRoute roleName={["hr_tools_nems_payroll"]}>
                  <ReleaseNoteView />
                </ProtectedRoute>
              ),
            },
            {
              path: "contractManagment",
              element: <ContractManagement />,
            },
            // {
            //   path: "appraisal",
            //   children: [
            //     { path: "initiateAppraisal", element: <PmsGroups /> },
            //     { path: "employeeAppraisal", element: <AppraisalForm /> },
            //   ],
            // },

            {
  path: "appraisal",
  children: [
    {
      path: "initiateAppraisal",
      element: (
        <ProtectedRoute
          roleName={[
            "hr_tools_nems_appraisal_initiate",
            "hr_tools_nems_appraisal_initiate$",
            "hr_tools_apprisal_initiate$",
          ]}
        >
          <PmsGroups />
        </ProtectedRoute>
      ),
    },
    {
      path: "employeeAppraisal",
      element: (
        <ProtectedRoute
          roleName={[
            "hr_tools_nems_appraisal_form",
            "hr_tools_nems_appraisal_form$",
          ]}
        >
          <AppraisalForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "inprogressAppraisal",
      element: (
        <ProtectedRoute roleName={["hr_tools_apprisal_inprogress$"]}>
          {/* Your in-progress component */}
        </ProtectedRoute>
      ),
    },
    {
      path: "approvedAppraisal",
      element: (
        <ProtectedRoute roleName={["hr_tools_apprisal_approved$"]}>
          {/* Your approved component */}
        </ProtectedRoute>
      ),
    },
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
                <ProtectedRoute roleName={["hr_config_employee_groups&subgroups"]}>
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
                  <EmployeeTable />
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
          path: "nexusHire",
          children: [
            {
              path: "candidateList",
              element: (
                <ProtectedRoute roleName={["hr_tools_nexusHire_candidateList"]}>
                  <CandidateList />
                </ProtectedRoute>
              ),
            },
            {
              path: "candidate/:candidateId?",
              element: (
                <ProtectedRoute
                  roleName={[
                    "hr_tools_nexusHire_candidateList_View",
                    "hr_tools_nexusHire_candidateList_Edit",
                    "hr_tools_nexusHire_candidate_approval_budgetApproval",
                    "hr_tools_nexusHire_candidate_approval_managementApproval",
                  ]}
                >
                  <Candidate />
                </ProtectedRoute>
              ),
            },
            {
              path: "candidate",
              element: (
                <ProtectedRoute roleName={["hr_tools_nexusHire_candidate"]}>
                  <Candidate />
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
  ]);
}
 
export default Router;
