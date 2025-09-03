import { Environment } from "../../environments/Environment";
import { axiosInstance } from "../interceptor/useAxiosInterceptors";

export const GetAllLeaveTypes = async () => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/leaveType/getAllLeaveTypes`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching leave types:", error);
    throw error;
  }
};

export const DedupeCheckWithLeaveTypeCode = async (leaveCode) => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/leaveType/dedupeCheck/${leaveCode}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error checking duplicate leave type (${leaveCode}):`, error);
    throw error;
  }
};

export const CreateOrUpdateLeaveType = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.apiUrl}/leaveType/createOrUpdateLeaveType`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating or updating leave type:", error);
    throw error;
  }
};

export const DeleteLeaveType = async (id) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.apiUrl}/leaveType/deleteLeaveType/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting leave type (${id}):`, error);
    throw error;
  }
};
