import { Environment } from "../../environments/Environment";
import { axiosInstance } from "../interceptor/useAxiosInterceptors";

export const GetAllProjects = async () => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/projects/getAllProjects`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const DedupeCheckWithProjectCode = async (projectId) => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/projects/dedupeCheckWithProjectCode/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error checking duplicate for project ID (${projectId}):`,
      error
    );
    throw error;
  }
};

export const CreateOrUpdateProject = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.apiUrl}/projects/createOrUpdateProject`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating/updating project:", error);
    throw error;
  }
};

export const DeleteProject = async (projectId) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.apiUrl}/projects/deleteProject/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting project ID (${projectId}):`, error);
    throw error;
  }
};
