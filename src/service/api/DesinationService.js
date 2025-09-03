import { Environment } from "../../environments/Environment";
import { axiosInstance as axios } from "../interceptor/useAxiosInterceptors";

export const GetAllDesignations = async () => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/designations/getAllDesignations`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching designations:", error);
    throw error;
  }
};

export const DedupeCheckWithDesignationCode = async (designationCode) => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/designations/dedupeCheck/${designationCode}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error in dedupe check for ${designationCode}:`, error);
    throw error;
  }
};

export const CreateOrUpdateDesignation = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/designations/createOrUpdateDesignation`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating/updating designation:", error);
    throw error;
  }
};

export const DeleteDesignation = async (id) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/designations/deleteDesignation/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting designation with ID ${id}:`, error);
    throw error;
  }
};
