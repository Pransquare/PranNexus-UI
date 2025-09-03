import { Environment } from "../../environments/Environment";
import { axiosInstance } from "../interceptor/useAxiosInterceptors";

export const GetAllCountries = async () => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/location/getAllCountries`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const GetDocumentsByCountryCode = async (code) => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/nationalityDocuments/getDocumentsByCountryCode/${code}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching documents for country code (${code}):`,
      error
    );
    throw error;
  }
};

export const GetDetailsByPincode = async (pincode) => {
  try {
    const response = await axiosInstance.get(
      `${Environment.apiUrl}/location/getDetailsByPincode?pincode=${pincode}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for pincode (${pincode}):`, error);
    throw error;
  }
};
