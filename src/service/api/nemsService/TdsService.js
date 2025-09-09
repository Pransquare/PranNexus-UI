import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const getSections = async () => {
  const response = await axios.get(`${Environment.apiUrl}/sections`);
  return response.data;
};

export const saveSections = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/sections`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save sections",
    };
  }
};
export const deleteSections = async (id) => {
  try {
    const response = await axios.delete(`${Environment.apiUrl}/sections/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete Sections",
    };
  }
};

export const deleteSubsection = async (id) => {
  try {
    const response = await axios.delete(
      `${Environment.apiUrl}/subsections/${id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete subsection",
    };
  }
};

export const getRegimes = async () => {
  const response = await axios.get(`${Environment.apiUrl}/Regimes`);
  return response.data;
};

export const saveRegimes = async (payload) => {
  try {
    const response = await axios.post(`${Environment.apiUrl}/Regimes`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save Regimes",
    };
  }
};

export const getFinancialYear = async () => {
  const response = await axios.get(`${Environment.apiUrl}/getFinancialYear`);
  return response.data;
};

export const getFinancialyearRegimeSectionConfig = async () => {
  const response = await axios.get(
    `${Environment.apiUrl}/getFinancialyearRegimeSectionConfig`
  );
  return response.data;
};

export const saveFinancialyearRegimeSectionConfig = async (payload) => {
  const response = await axios.post(
    `${Environment.apiUrl}/saveFinancialyearRegimeSectionConfig`,
    payload
  );
  return response.data;
};
export const updateFinancialyearRegimeSectionConfig = async (payload) => {
  try {
    const response = await axios.put(`${Environment.apiUrl}/update`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to Update TDS Details",
    };
  }
};
export const getConfigByFinancialYearCode = async (financialYearCode) => {
  const response = await axios.get(
    `${Environment.apiUrl}/getConfigByFinancialYearCode?financialYearCode=${financialYearCode}`
  );
  return response.data;
};
export const getBySectionCodes = async (payload) => {
  const response = await axios.post(
    `${Environment.apiUrl}/getBySectionCodes`,
    payload
  );
  return response.data;
};
export const saveFinancialYear = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/saveFinancialYear`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save financial year",
    };
  }
};
export const deleteFinancialYear = async (id) => {
  try {
    const response = await axios.delete(
      `${Environment.apiUrl}/deleteFinancialYear/${id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to delete financial year",
    };
  }
};
export const deleteRegime = async (id) => {
  try {
    const response = await axios.delete(`${Environment.apiUrl}/Regimes/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete Regime",
    };
  }
};
export const getSubSections = async () => {
  const response = await axios.get(`${Environment.apiUrl}/subsections`);
  return response.data;
};

export const saveSubSections = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/subsections`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save Sub-Sections",
    };
  }
};
export const deleteSubSections = async (id) => {
  try {
    const response = await axios.delete(
      `${Environment.apiUrl}/subsections/${id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete subsection",
    };
  }
};

export const getSectionSubsectionConfig = async () => {
  const response = await axios.get(
    `${Environment.apiUrl}/getSectionSubsectionConfig`
  );
  return response.data;
};

export const saveSectionSubsectionConfig = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/saveSectionSubsectionConfig`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to save Section Sub-section Config Details",
    };
  }
};

export const deleteSectionSubsectionConfig = async (id) => {
  try {
    const response = await axios.delete(
      `${Environment.apiUrl}/deleteSectionSubsectionConfig/${id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete Sub-Sections",
    };
  }
};
export const deleteFinancialyearRegimeSectionConfig = async (id) => {
  try {
    const response = await axios.delete(
      `${Environment.apiUrl}/deleteFinancialyearRegimeSectionConfig/${id}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete Sub-Sections",
    };
  }
};
export const SaveTdsDetails = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/tdsdetails/saveTdsDetails`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to save Section Sub-section Config Details",
    };
  }
};
export const getTdsDetailsByEmployeeCode = async (employeeCode) => {
  try {

    const response = await axios.get(`${Environment.nemsUrl}/tdsdetails/getTdsDetailsByEmployeeCode`, {
      params: { employeeCode },
    });
    return { success: true, data: response.data }; 

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch TDS details",
    };
  }
};
export const updateTdsDetails = async (payload) => {
  try {
    const response = await axios.put(
      `${Environment.nemsUrl}/tdsdetails/updateTdsDetails`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to Update TDS Details",
    };
  }
};
export const getEmployeeFinancialDetails = async (
  employeeCode,
  financialYearCode,
  page = 0,
  size = 20
) => {
  try {
    const response = await axios.get(
      `${Environment.nemsUrl}/tdsdetails/search`,
      {
        params: {
          employeeCode,
          financialYearCode,
          page,
          size,
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch employee financial details",
    };
  }
};

export const updateFinancialYear = async (payload) => {
  try {
    const response = await axios.put(
      `${Environment.apiUrl}/updateFinancialYear`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to update financial year",
    };
  }
};

export const updateRegime = async (payload) => {
  try {
    const response = await axios.put(
      `${Environment.apiUrl}/Regimes/updateRegime`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update regime",
    };
  }
};

export const updateSection = async (payload) => {
  try {
    const response = await axios.put(
      `${Environment.apiUrl}/sections/updateSection`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update section",
    };
  }
};

export const updateSubsection = async (payload) => {
  try {
    const response = await axios.put(
      `${Environment.apiUrl}/subsections/updateSubsection`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update subsection",
    };
  }
};

export const updateSectionSubsectionConfig = async (payload) => {
  try {
    const response = await axios.put(
      `${Environment.apiUrl}/updateSectionSubsectionConfig`,
      payload
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to update configuration",
    };
  }
};
export const enableProofDeclarationForEmployee = async (employeeCode) => {
  try {
    // Sending the employeeCode as a URL parameter
    const response = await axios.put(
      `${Environment.nemsUrl}/tdsdetails/enableProofDeclarationForEmployee?employeeCode=${employeeCode}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to enable proof declaration for employee",
    };
  }
};

export const enableProofDeclarationForAllActiveEmployees = async () => {
  try {
    const response = await axios.put(
      `${Environment.nemsUrl}/tdsdetails/enableProofDeclarationForAllActiveEmployees`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to enable proof declaration for all active employees",
    };
  }
};
export const enableTaxDeclarationForEmployee = async (employeeCode) => {
  try {
    // Sending the employeeCode as a URL parameter
    const response = await axios.put(
      `${Environment.nemsUrl}/tdsdetails/enableTaxDeclarationForEmployee?employeeCode=${employeeCode}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to enable proof declaration for employee",
    };
  }
};
export const enableTaxDeclarationForAllActiveEmployees = async () => {
  try {
    const response = await axios.put(
      `${Environment.nemsUrl}/tdsdetails/enableTaxDeclarationForAllActiveEmployees`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to enable proof declaration for all active employees",
    };
  }
};
export const saveProofDetails = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/tdsProofDetails/saveProofDetails`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save proof details",
    };
  }
};

export const downloadFile = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/Payroll/downloadResponseFile`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob", // To handle file downloads
      }
    );
    // Create a Blob URL and trigger a download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", payload.filePath.split("\\").pop()); // Use file name
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to download file",
    };
  }
};
export const updateTdsStatus = async (employeeCode, status) => {
  try {
    const response = await axios.put(
      `${Environment.nemsUrl}/tdsdetails/updateTdsStatus`,

      null,

      {
        params: { employeeCode, status },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update TDS status",
    };
  }
};
export const deleteProofDetails = async (tdsProofId) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/tdsProofDetails/deleteProofDetails?tdsProofId=${tdsProofId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to delete proof details",
    };
  }
};

export const deleteByFinancialYearCodeAndRegimeCode = async (
  financialYearCode,
  regimeCode
) => {
  try {
    const response = await axios.delete(
      `${Environment.apiUrl}/deleteByFinancialYearCodeAndRegimeCode`,
      {
        params: { financialYearCode, regimeCode },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete by Financial Year Code and Regime Code",
    };
  }
};
