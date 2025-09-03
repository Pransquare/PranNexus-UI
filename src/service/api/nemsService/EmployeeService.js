import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetEmployeeByEmployeeCode = async (employeeCode) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/getEmployeeByEmployeeCode/${employeeCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeeByEmployeeCode:", error);
    throw error;
  }
};

export const GetEmployeesByStatus = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/getAllEmployeesByStatus`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeesByStatus:", error);
    throw error;
  }
};
export const GetAllEmployeeByStatus = async (statusCode) => {
  try {
    // Construct the correct URL with query parameter status
    const response = await axios.get(
      `${Environment.emsUrl}/employee/employeesByStatus`,
      {
        params: { status: statusCode }, // Correct format: status=108 or status=117
      }
    );
    return response.data; // Return the employee data
  } catch (error) {
    console.error(
      "Error fetching employees by status:",
      error.response || error.message
    );
    throw error; // Rethrow the error for further handling
  }
};

export const SaveApproverConfig = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/ApproverConfig/saveApproverConfig`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in SaveApproverConfig:", error);
    throw error;
  }
};

export const GetAllByEmpId = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/ApproverConfig/getAllByEmpId`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetAllByEmpId:", error);
    throw error;
  }
};

export const CreateOrUpdateEmployee = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/createOrUpdateEmployee`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in CreateOrUpdateEmployee:", error);
    throw error;
  }
};

export const GetEmployeesByName = async (name) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/employees/search?input=${name}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeesByName:", error);
    throw error;
  }
};

export const OffboardMember = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/employee/offboard`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in OffboardMember:", error);
    throw error;
  }
};

export const GetEmployeeCtcDetails = async (employeeId) => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/getEmployeeCtc?employeeId=${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeeCtcDetails:", error);
    throw error;
  }
};

export const DownloadPayslip = async (empBasicDetailId, year, month) => {
  try {
    const response = await axios.post(
      `${Environment.emsUrl}/Payroll/viewOrDownloadPayslip`,
      {
        empBasicDetailId,
        year,
        month,
      },
      { responseType: "blob" }
    );
    return response;
  } catch (error) {
    console.error("Error in DownloadPayslip:", error);
    throw error;
  }
};

export const GetBirthdayList = async () => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/getBirthdayList`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetBirthdayList:", error);
    throw error;
  }
};

export const GetEmployeeCounts = async () => {
  try {
    const response = await axios.get(
      `${Environment.emsUrl}/employee/employee-counts`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetEmployeeCounts:", error);
    throw error;
  }
};
