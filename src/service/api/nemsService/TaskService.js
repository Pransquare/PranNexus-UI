import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetAllTasks = async () => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/taskMaster/getAllTasks`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
