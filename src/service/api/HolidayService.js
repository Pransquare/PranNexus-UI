import { Environment } from "../../environments/Environment";
import { axiosInstance as axios } from "../interceptor/useAxiosInterceptors";

export const GetAllHolidays = async (data) => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/holiday/getAllHolidays?workLocation=${data.workLocation}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAllHolidays:", error);
    throw error;
  }
};
