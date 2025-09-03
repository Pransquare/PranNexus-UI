import { Toaster } from "../../../common/alertComponets/Toaster";
import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const UploadPayrollFile = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/uploadPayrollFile`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in UploadPayrollFile:", error);
    throw error;
  }
};

export const DownloadOrViewPayslip = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/viewOrDownloadPayslip`,
      data,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    // Custom error handling
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        Toaster("error", "Payslip not found for the selected employee.");
      } else if (status === 500) {
        Toaster("error", "Server error occurred. Please try again later.");
      } else {
        Toaster("error", `Unexpected error: ${status}`);
      }
    } else {
      Toaster("error", "Network error or server not responding.");
    }

    console.error("Error in DownloadOrViewPayslip:", error);
    throw error;
  }
};

export const ValidatePayroll = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/validatePayroll`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in ValidatePayroll:", error);
    throw error;
  }
};

export const MigrateToPayrollMaster = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/migrateToPayrollMaster`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in MigrateToPayrollMaster:", error);
    throw error;
  }
};

export const DownloadResponseFile = async (filePath) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/downloadResponseFile`,
      { filePath },
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    // Custom error handling
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        Toaster(
          "error",
          "Profile picture not found for the selected employee."
        );
      } else if (status === 500) {
        Toaster("error", "Server error occurred. Please try again later.");
      } else {
        Toaster("error", `Unexpected error: ${status}`);
      }
    } else {
      Toaster("error", "Network error or server not responding.");
    }

    console.error("Error in DownloadOrViewPayslip:", error);
    throw error;
  }
};

export const DownloadFile = async (filePath) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/downloadResponseFile`,
      { filePath },
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    console.error("Error in DownloadFile:", error);
    throw error;
  }
};

export const DownloadSampleTemplate = async () => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/Payroll/downloadSampleTemplate`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in DownloadSampleTemplate:", error);
    throw error;
  }
};

export const updateRoleTypes = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.loginUrl}/updateRoleTypes`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateRoleTypes:", error);
    throw error;
  }
};

export const GetPayrollDetailsByEmployeeID = async (employeeID) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/Payroll/getEmpoyeePayrollDetails?employeeId=${employeeID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPayrollDetailsByEmployeeID:", error);
    throw error;
  }
};

export const GetEmployeePayslipDetailsById = async (employeeID) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee-payslip/by-employee/${employeeID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPayrollDetailsByEmployeeID:", error);
    throw error;
  }
};

export const SaveorUpdatePayslipDetails = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee-payslip/create-update`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetPayrollDetailsByEmployeeID:", error);
    throw error;
  }
};
