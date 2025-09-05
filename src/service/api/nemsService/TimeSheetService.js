import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetTimesheetDetails = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/getTimesheetDetails`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateOrUpdateTimesheet = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/saveOrUpdateAttendance`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DeleteTimesheet = async (timesheetId) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/deleteTimesheet/${timesheetId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetAllTimesheets = async () => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/Timesheet/getAllTimesheets`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const SerchAttendanceDetails = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/serchAttendanceDetails`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const SendForApprovalAndApprove = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/sendForApprovalAndApprove`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetEmployeesByApproverId = async (approverId, module) => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/ApproverConfig/getEmployeesByApproverId/${approverId}/${module}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const GetTimesheetReport = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/timesheetReport`,
      data,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching timesheet report:", error);
    throw error;
  }
};
export const GenerateLeaveReport = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/employeeLeave/generateLeaveReport`,
      data,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating leave report:", error);
    throw error;
  }
};

export const GenerateProjectReport = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/reports/projectReport`,
      data,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating leave report:", error);
    throw error;
  }
};

export const GenerateAttComReport = async (data) => {
  try {
    const params = new URLSearchParams();
    params.append("employeeId", data.employeeId || 0);
    params.append("fromDate", data.fromDate);
    params.append("toDate", data.toDate);
    params.append("type", data.type);

    // Append each workLocationCodes as separate query param
    (data.workLocationCodes || []).forEach((code) =>
      params.append("workLocationCodes", code)
    );

    const response = await axios.get(
      `${
        Environment.nemsUrl
      }/reports/attendance-compliance-effort-reportNew?${params.toString()}`,
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
    link.download = `${data.type}_report.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error generating attendance compliance report:", error);
    throw error;
  }
};

export const GenerateTimeSheetReportForManager = async (data) => {
  try {
    const workLocationCodes = data.workLocationCode?.length
      ? data.workLocationCode.join(",")
      : "";

    const response = await axios.get(
      `${Environment.nemsUrl}/reports/manager-timesheet-report?employeeId=${
        data.employeeId || 0
      }&fromDate=${data.fromDate}&toDate=${data.toDate}&type=${
        data.type
      }&workLocationCode=${workLocationCodes}&managerId=${data.managerId}`,
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
    link.download = `Employee Timesheet Report.xlsx`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error generating manager timesheet report:", error);
    throw error;
  }
};

export const WeekendDateCheck = async (data) => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/Timesheet/weekendValidation?employeeId=${data.empBasicDetailId}&taskDate=${data.taskDate}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetWeekendApprovals = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/getWeekendApprovals`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const SaveAndApproveWeekend = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/saveAndApproveWeekend`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const findEmployeeLeaveDetailsForGrid = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/employeeLeave/findEmployeeLeaveDetailsForGrid`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAttendanceForGrid = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Timesheet/searchAttendanceForGrid`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetManagerTimesheetGrid = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/reports/managerTimesheetGrid`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manager timesheet grid:", error);
    throw error;
  }
};
