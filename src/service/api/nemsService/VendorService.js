import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const SaveVendor = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/api/vendor/saveVendor`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const SearchVendor = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/api/vendor/search`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const ApproveOrRejectVendor = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/api/vendor/approveOrRejectVendor`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DownloadVendorReport = async ({
  vendorName = null,
  client = null,
  workflowStatuses = null,
  managerId = null,
  page = 0,
  size = 0,
  startDate = null,
  endDate = null,
}) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/api/vendor/vendorReport`,
      {
        vendorName,
        client,
        workflowStatuses,
        managerId,
        page,
        size,
        startDate,
        endDate,
      },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "vendor_report.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading the vendor report:", error);
    throw error;
  }
};
