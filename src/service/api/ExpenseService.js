import { Environment } from "../../environments/Environment";
import { axiosInstance } from "../interceptor/useAxiosInterceptors";

export const GetAllExpenseListFromMaster = async () => {
  try {
    const response = await axiosInstance.get(`${Environment.apiUrl}/expense`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expense list:", error);
    throw error;
  }
};

export const SaveExpense = async (data) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.nemsUrl}/expense/save`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error saving expense:", error);
    throw error;
  }
};

export const UploadExpense = async (data, employeeCode, type = null) => {
  try {
    const url = `${
      Environment.nemsUrl
    }/expense/billUpload?employeeCode=${employeeCode}${
      type ? `&type=${type}` : ""
    }`;
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error uploading expense:", error);
    throw error;
  }
};

export const RemoveBillUrl = async (employeeCode) => {
  try {
    const response = await axiosInstance.put(
      `${Environment.nemsUrl}/expense/removeBillUrl?employeeCode=${employeeCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing bill URL:", error);
    throw error;
  }
};

export const Search = async (data) => {
  try {
    const response = await axiosInstance.post(
      `${Environment.nemsUrl}/expense/search`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error searching expenses:", error);
    throw error;
  }
};

export const GetExpenseById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${Environment.nemsUrl}/expense/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching expense by ID (${id}):`, error);
    throw error;
  }
};

export const UpdateBillStatus = async (data) => {
  try {
    const response = await axiosInstance.put(
      `${Environment.nemsUrl}/expense/updateExpenseBill`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating bill status:", error);
    throw error;
  }
};

export const UpdateExpenseStatus = async (data) => {
  try {
    const response = await axiosInstance.put(
      `${Environment.nemsUrl}/expense/updateExpense`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expense status:", error);
    throw error;
  }
};

export const DownloadExpenseReport = async (employeeId, date) => {
  try {
    const response = await axiosInstance.get(
      `${Environment.nemsUrl}/reports/expense-report`,
      {
        params: { employeeId, date },
        responseType: "blob", // Important to handle binary data
      }
    );

    // Create a Blob from the response data
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download URL and trigger the download
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "expense_report.xlsx";
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading the expense report:", error);
    throw error;
  }
};
