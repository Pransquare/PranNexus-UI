import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetEmployees = async (performanceGroup, performanceSubGroup) => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/employee/employeeGroup`,
      {
        params: {
          performanceGroup,
          performanceSubGroup,
        },
      }
    );
    console.log(Environment.nemsUrl);
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
      `${Environment.nemsUrl}/employee/employeeGroupNew`,
      {
        params: {
          performanceGroup,
          performanceSubGroup,
        },
      }
    );
    console.log(Environment.nemsUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
