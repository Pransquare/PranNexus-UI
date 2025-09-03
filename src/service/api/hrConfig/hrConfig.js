import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetGroupAndSubgroups = async () => {
  try {
    const response = await axios.get(`${Environment.apiUrl}/groups/getGroup`);
    return response.data;
  } catch (error) {
    console.error("Error in GetGroupAndSubgroups:", error);
    throw error;
  }
};

export const SearchGoalsByGroupAndSubgroup = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Goals/searchGoalsByGroupAndSubgroup`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in SearchGoalsByGroupAndSubgroup:", error);
    throw error;
  }
};

export const SaveGoalsforGroup = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Goals/saveGoalsforGroup`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveGoalsforGroup:", error);
    throw error;
  }
};

export const GetEmployeeProjects = async (data) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employeeProjectContoller/employeeProjects/${data}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeeProjects:", error);
    throw error;
  }
};

export const SaveOrUpdateEmployeeProjects = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeProjectContoller/saveOrUpdateEmployeeProjectConfig`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveOrUpdateEmployeeProjects:", error);
    throw error;
  }
};

export const SaveOrUpdateEmployeeProjectsConfig = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employeeProjectContoller/saveOrUpdate`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveOrUpdateEmployeeProjects:", error);
    throw error;
  }
};

export const GetAllGoals = async () => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/groups/getAllGoals`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAllGoals:", error);
    throw error;
  }
};

export const GetAllWorkLocation = async () => {
  try {
    const response = await axios.get(`${Environment.apiUrl}/workLocation`);
    return response.data;
  } catch (error) {
    console.error("Error in GetAllWorkLocation:", error);
    throw error;
  }
};
