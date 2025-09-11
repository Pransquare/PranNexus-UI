import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const createCandidate = async (formData) => {
  try {
    const response = await axios.post(`${Environment.nexusHireUrl}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};

export const createOrUpdateCandidate = async (formData, isSaved) => {
  try {
    const response = await axios.post(
      `${Environment.nexusHireUrl}/create?isSaved=${isSaved}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating or updating candidate:", error);
    throw error;
  }
};

export const getAllCandidates = async () => {
  try {
    const response = await axios.get(`${Environment.nexusHireUrl}/gatAll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all candidates:", error);
    throw error;
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const response = await axios.get(
      `${Environment.nexusHireUrl}/${candidateId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching candidate by ID (${candidateId}):`, error);
    throw error;
  }
};

export const updateCandidate = async (candidateId, formData) => {
  try {
    const response = await axios.put(
      `${Environment.nexusHireUrl}/${candidateId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating candidate (${candidateId}):`, error);
    throw error;
  }
};

export const uploadOfferLetter = async (candidateId, offerLetter) => {
  try {
    const response = await axios.post(
      `${Environment.nexusHireUrl}/${candidateId}/upload`,
      offerLetter,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error uploading offer letter for candidate (${candidateId}):`,
      error
    );
    throw error;
  }
};

export const getAllStatusMaster = async () => {
  try {
    const response = await axios.get(
      `${Environment.nexusHireUrl}/statusMaster`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all status master:", error);
    throw error;
  }
};

export const getAllWorkflowStatusMaster = async () => {
  try {
    const response = await axios.get(
      `${Environment.nexusHireUrl}/workflowStatusMaster`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching workflow status master:", error);
    throw error;
  }
};

export const DownloadFile = async (filePath) => {
  try {
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await axios.get(
      `${Environment.nemsUrl}/Payroll/downloadpdf?filePathInput=${encodedFilePath}`,
      {
        headers: {
          "Content-Type": "application/pdf",
        },
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error downloading file (${filePath}):`, error);
    throw error;
  }
};

export const SendOfferLetter = async (candidateId, filePath) => {
  try {
    const response = await axios.post(
      `${Environment.nexusHireUrl}/${candidateId}/send-email`,
      null,
      {
        params: { filePath }, // Pass filePath as a query parameter
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error sending offer letter for candidate (${candidateId}):`,
      error
    );
    throw error;
  }
};

export const OnboardCandidate = async (candidateId, modifiedBy) => {
  try {
    const response = await axios.post(
      `${Environment.nexusHireUrl}/${candidateId}/onboard/${modifiedBy}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error onboarding candidate (${candidateId}):`, error);
    throw error;
  }
};
