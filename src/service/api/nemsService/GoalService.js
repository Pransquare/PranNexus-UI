import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const CreateOrUpdateGoal = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/basicgoals/saveGoal`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error in CreateOrUpdateGoal:", error);
    throw error;
  }
};

export const DeleteGoal = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/employee/getAllEmployeesByStatus`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeesByStatus:", error);
    throw error;
  }
};

export const GetAllGoals = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/basicgoals/searchGoals`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAllGoals:", error);
    throw error;
  }
};
export const searchEmployeeForGoal = async (name) => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/employee/searchEmployeeForGoal?input=${name}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in Search Employee For Goal:", error);
    throw error;
  }
};
export const initiateGoalSetup = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/goalsetup/initiateGoalSetup`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error while Initiating Goal Setup:", error);
    throw error;
  }
};
export const searchGoals = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/goalsetup/searchGoals`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching data from search Goals:", error);
    throw error;
  }
};
export const setUpGoals = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/goalsetup/setUpGoals`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching data from setup Goals:", error);
    throw error;
  }
};

export const searchAttributes = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/attributes/searchAttributes`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error in searchAttributes:", error);
    throw error;
  }
};

export const saveOrUpdateAttributes = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/attributes/saveOrUpdateAttributes`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in saveOrUpdateAttributes:", error);
    throw error;
  }
};
