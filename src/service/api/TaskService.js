import { Environment } from "../../environments/Environment";
import { axiosInstance } from "../interceptor/useAxiosInterceptors";

export const GetAllTasks = async () => {
  try {
    const response = await axiosInstance.get(
      `${Environment.emsUrl}/taskMaster/getAllTasks`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export const CreateOrUpdateTask = async (task) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.emsUrl}/taskMaster/createOrUpdateTask`,
      task
    );
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

export const DeleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(
      `${Environment.emsUrl}/taskMaster/deleteTask/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}