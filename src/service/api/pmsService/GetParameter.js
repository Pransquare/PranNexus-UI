import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetParams = async (empId, employeeType) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/getParamsByEmployeeId`,
      { params: { empId, employeeType } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UpdateApprisalDetails = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/updateApprisalDetails`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateAttributeDetails = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/updateAttributeDetails`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const SearchPerformanceReviews = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/searchPerformanceReviews`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const UploadAppraisalLetter = async (
  createdBy,
  empBasicDetailId,
  status,
  multipartFile
) => {
  try {
    const formData = new FormData();
    formData.append("multipartFile", multipartFile);
    formData.append("createdBy", createdBy);
    formData.append("empBasicDetailId", empBasicDetailId);
    formData.append("status", status);

    const response = await axios.post(
      `${Environment.emsUrl}/employee/uploadAppraisalLetter`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
