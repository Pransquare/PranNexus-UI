import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import {
  getAllCandidates,
  getAllStatusMaster,
  getAllWorkflowStatusMaster,
} from "../../../service/api/NexushireService/smartHire";
import { useNavigate } from "react-router-dom";
import { UserManagentCheck } from "../../../common/UserManagement";

function CandidateList() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [statusMaster, setStatusMaster] = useState({});
  const [workflowStatusMaster, setWorkflowStatusMaster] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const canEdit = UserManagentCheck("hr_tools_smartHire_candidateList_Edit");
  const canView = UserManagentCheck("hr_tools_smartHire_candidateList_View");
  const admin = UserManagentCheck("admin");
  const budget = UserManagentCheck(
    "hr_tools_smartHire_candidate_approval_budgetApproval"
  );
  const management = UserManagentCheck(
    "hr_tools_smartHire_candidate_approval_managementApproval"
  );

  const createStatusMap = (statusList) => {
    return statusList.reduce((map, status) => {
      map[status.code] = status.description;
      return map;
    }, {});
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const candidates = await getAllCandidates();
      console.log("Candidates:", candidates);

      const sortedCandidates = candidates.sort((a, b) => 
        new Date(b.modifiedDate) - new Date(a.modifiedDate) // Ensures the latest date comes first
      );

      const filteredCandidates = canView
      ? sortedCandidates.filter((candidate) => {

          if(admin) return true; // Show all candidates for admin
          // Exclude candidates with workflowStatus "400"
          if (candidate.workflowStatus === "400") return false;

          // Show candidates based on workflowStatus for budget and management
          if (budget && candidate.workflowStatus === "100") return true; // Show for budget
          if (management && candidate.workflowStatus === "101") return true; // Show for management

          // Exclude candidates not matching any criteria
          return false;
        })
      : sortedCandidates;

      console.log("Filtered candidates:", filteredCandidates);

      const statusMasterData = await getAllStatusMaster();
      console.log("Status Master Data:", statusMasterData);

      const workflowStatusMasterData = await getAllWorkflowStatusMaster();
      console.log("Workflow Status Master Data:", workflowStatusMasterData);

      const statusMap = createStatusMap(statusMasterData);
      console.log("Status Map:", statusMap);

      const workflowStatusMap = createStatusMap(workflowStatusMasterData);
      console.log("Workflow Status Map:", workflowStatusMap);

      console.log("Workflow Status", candidates.workflowStatus);

      setData(filteredCandidates);
      setStatusMaster(statusMap);
      setWorkflowStatusMaster(workflowStatusMap);

      // Show success toast for successful data fetch
      Toaster("success", "Data fetched successfully!");
    } catch (error) {
      console.error("Failed to get Candidate data", error);

      // Show error toast for failed data fetch
      Toaster("error", "Failed to get Candidate data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
 
  useEffect(() => {
    setHeaders([
      "Requirement Id",
      "Requirement Details",
      "Name",
      "Primary Skill",
      "Expected CTC",
      "Status",
      "Workflow Status",
      "Action",
    ]);
  }, []);

  const getStatusDescription = (code) => statusMaster[code] || code;
  const getWorkflowStatusDescription = (code) =>
    workflowStatusMaster[code] || code;

  const contentConfig = useCallback(
    (input) => {
      return {
        actions: {
          edit: canEdit,
          view: canView,
        },
        content: input.map((candidate) => [
          {
            forAction: false,
            isPrint: true,
            value: candidate.requirementId,
          },
          {
            isPrint: true,
            forAction: false,
            value: candidate.requirementDesc || "",
          },
          {
            forAction: false,
            isPrint: true,
            value: `${candidate.firstName} ${candidate.lastName}`,
          },
          {
            forAction: false,
            isPrint: true,
            value: candidate.primarySkill,
          },
          {
            forAction: false,
            isPrint: true,
            value: candidate.expectedCtc,
          },
          {
            forAction: false,
            isPrint: true,
            value: getStatusDescription(candidate.status) || "",
          },
          {
            forAction: false,
            isPrint: true,
            value: getWorkflowStatusDescription(candidate.workflowStatus) || "",
          },
          {
            forAction: true,
            isPrint: false,
            value: { ...candidate },
          },
        ]),
      };
    },
    [statusMaster, workflowStatusMaster]
  );

  const viewData = useCallback(
    (candidate) => {
      navigate(`/home/smartHire/candidate/${candidate.id}`, {
        state: {
          status: getStatusDescription(candidate.status),
          workflowStatusDescription: getWorkflowStatusDescription(
            candidate.workflowStatus
          ),
        },
      });
    },
    [navigate, getWorkflowStatusDescription, getStatusDescription]
  );

  const editData = useCallback(
    (candidate) => {
      navigate(`/home/smartHire/candidate/${candidate.id}`, {
        state: {
          status: getStatusDescription(candidate.status),
          workflowStatusDescription: getWorkflowStatusDescription(
            candidate.workflowStatus
          ),
        },
      });
    },
    [navigate, getWorkflowStatusDescription, getStatusDescription]
  );

  const actionClick = useCallback(
    (event, item) => {
      switch (event) {
        case "edit":
          editData(item);
          break;
        case "view":
          viewData(item);
          break;
        default:
          break;
      }
    },
    [viewData]
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Candidate List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <ConfigTable
          data={contentConfig(data)}
          headers={headers}
          actions={actionClick}
          alignment={[
            "left",
            "left",
            "left",
            "left",
            "right",
            "left",
            "left",
            "left",
          ]}
        />
      )}
    </Box>
  );
}

export default CandidateList;
