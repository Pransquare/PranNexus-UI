
import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const SaveSowDetails = async (data) =>{
    try{
        const response = await axios.post(`${Environment.emsUrl}/sow/saveSowDetails`, data);
        return response.data;
    } catch(error){
        console.error(error);
        throw error;
    }
}
export const getSowDetails = async (employeeId, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${Environment.emsUrl}/sow/getSowDetails/${employeeId}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching SOW details:", error);
        throw error;
    }
};
export const updateSowDetails = async (id, data) => {
    try {
        const response = await axios.put(`${Environment.emsUrl}/sow/updateSowDetails/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating SOW details:", error);
        throw error;
    }
};
export const deleteSowDetails = async (id) => {
    try {
        const response = await axios.delete(`${Environment.emsUrl}/sow/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting SOW details:", error);
        throw error;
    }
};
export const generateSowReport = async (fromDate, toDate, status, deliveryManagerIds) => {
  try {
    const payload = {
      fromDate: fromDate,
      toDate: toDate,
      status: status,
      deliveryManagerId: deliveryManagerIds, 
    };

    const response = await axios.post(
      `${Environment.emsUrl}/sow/generateSowReport`,
      payload,
      {
        responseType: 'blob', 
      }
    );

    if (response.data) {
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SOW_Report_${fromDate}_to_${toDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return 'Report downloaded successfully';
    } else {
      throw new Error('No data received');
    }
  } catch (error) {
    console.error("Error generating SOW report:", error);
    throw error;
  }
};
  export const getSowIds = async (account, status) => {
    try {
        const response = await axios.get(`${Environment.emsUrl}/sow/getSowIds`, {
            params: { account, status },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching SOW IDs:", error);
        throw error;
    }
};
export const searchSowDetails = async (searchParams) => {
  try {
    const response = await axios.post(`${Environment.emsUrl}/sow/search`, searchParams);
    return response.data;
  } catch (error) {
    console.error("Error searching SOW details:", error);
    throw error;
  }
};
export const getReportingIds = async (managerId) => {
  try {
      const response = await axios.get(`${Environment.emsUrl}/employee/getReportingIds`, {
          params: { managerId },
      });
      return response.data; 
  } catch (error) {
      console.error("Error fetching reporting IDs:", error);
      throw error;
  }
};