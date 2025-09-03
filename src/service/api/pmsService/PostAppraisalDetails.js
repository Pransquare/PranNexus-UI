import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const PostAppraisalDetails = async (appraisalDetails) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/initiate`,
      appraisalDetails // This is the data you want to send in the request body
    );
    return response.data;
  } catch (error) {
    console.error("Error posting appraisal details:", error);
    throw error;
  }
};
