import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetAllNews = async () => {
  try {
    const response = await axios.get(`${Environment.emsUrl}/news`);
    return response.data;
  } catch (error) {
    console.error("Error in GetAllNews:", error);
    throw error;
  }
};
