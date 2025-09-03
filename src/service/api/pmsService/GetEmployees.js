import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetEmployees = async (performanceGroup, performanceSubGroup) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/employeeGroup`,
      {
        params: {
          performanceGroup,
          performanceSubGroup,
        },
      }
    );
    console.log(Environment.emsUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const GetEmployeesNew = async (
  performanceGroup,
  performanceSubGroup
) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/employeeGroupNew`,
      {
        params: {
          performanceGroup,
          performanceSubGroup,
        },
      }
    );
    console.log(Environment.emsUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
