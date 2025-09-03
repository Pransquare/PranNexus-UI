import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetSubGroups = async (groupId) => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/groups/getsubgroup/${groupId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subgroups:", error);
    throw error;
  }
};
