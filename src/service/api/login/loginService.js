import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${Environment.loginUrl}/apiiLogin`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const register = async (credentials) => {
  try {
    const response = await axios.post(
      `${Environment.loginUrl}/register`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

export const ResetPassword = async (credentials) => {
  try {
    const response = await axios.post(
      `${Environment.loginUrl}/passwordReset`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const GetRoleNamesByUsername = async (userName) => {
  try {
    const response = await axios.get(
      `${Environment.loginUrl}/Pransquare/Roles/getRoleNamesByUsername?username=${userName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching role names by username:", error);
    throw error;
  }
};

export const GetDataForMicrosoftLogin = async (mailId) => {
  try {
    const response = await axios.get(
      `${Environment.loginUrl}/Pransquare/Roles/getDataForMicrosoftLogin/${mailId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Microsoft login data:", error);
    throw error;
  }
};

export const GetAllRoleName = async (employeeCode) => {
  try {
    const response = await axios.get(
      `${Environment.loginUrl}/getRoleNames?employeeCode=${employeeCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all role names:", error);
    throw error;
  }
};

export const GetMicrosoftToken = async (credentials) => {
  try {
    const response = await axios.post(
      `${Environment.microsoftLoginURL}/getToken`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Microsoft token:", error);
    throw error;
  }
};

export const SendOtp = async (email) => {
  try {
    const response = await axios.post(
      `${Environment.loginUrl}/sendOtp?email=${email}`
    );
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const ResetPwdWithOtp = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.loginUrl}/validate`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password with OTP:", error);
    throw error;
  }
};
