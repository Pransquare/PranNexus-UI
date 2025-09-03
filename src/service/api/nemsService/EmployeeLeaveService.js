import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetEmployeeLeaveDetails = async (employeeId) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employeeLeave/getEmployeeLeaveDetails/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createOrUpdateEmployeeLeave = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeLeave/createOrUpdateEmployeeLeave`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DeleteEmployeeLeave = async (leaveId) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeLeave/deleteEmployeeLeave/${leaveId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetManagerName = async (employeeBasicDetailId, moduleName, data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/ApproverConfig/getApproverByEmpIdAndModule?employeeBasicDetailId=${employeeBasicDetailId}&moduleName=${moduleName}`,
      data 
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const FindEmployeeLeaves = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeLeave/findEmployeeLeaveDetails`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetEmployeeLeaveByApproverId = async (employeeId) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employeeLeave/getEmployeeLeavesByApproverId/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ChangeEmployeeLeaveStatus = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeLeave/changeEmployeeLeaveStatus/${data.employeeLeaveId}/status/${data.status}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetEmployeeLeaveConfigDetails = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeLeave/employeeLeaveConfig`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
