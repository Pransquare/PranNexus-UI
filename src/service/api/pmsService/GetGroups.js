import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetGroups = async () => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/groups/getGroup`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
