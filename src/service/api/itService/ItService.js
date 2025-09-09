import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const GetEmployee = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/employee/getAllEmployeesForMailCreation`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateEmailAndRolesForUser = async (data) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/employee/updateEmployeeRolesAndEmail`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetAllRoleType = async (data) => {
  try {
    const response = await axios.get(
      `${Environment.loginUrl}/Pransquare/Roles/getAllRoleType`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UploadReleaseNotes = async (
  file,
  releaseName,
  releaseVersion,
  releaseDate,
  createdBy
) => {
  try {
    const url = `${Environment.apiUrl}/releaseNotes/uploadReleaseNotes`;

    // Creating FormData for file upload
    const formData = new FormData();
    formData.append("file", file);

    // Constructing query parameters
    const queryParams = new URLSearchParams({
      releaseName,
      releaseVersion,
      releaseDate,
      createdBy,
    }).toString();

    const response = await axios.post(`${url}?${queryParams}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading release notes:", error);
    throw error;
  }
};

export const SearchReleaseNotes = async (searchParams) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/releaseNotes/search`,
      searchParams
    );
    return response.data;
  } catch (error) {
    console.error("Error searching release notes:", error);
    throw error;
  }
};

export const DownloadReleaseNote = async (fileName) => {
  try {
    const url = `${
      Environment.apiUrl
    }/releaseNotes/download/${encodeURIComponent(fileName)}`;

    const response = await axios.get(url, {
      responseType: "blob",
    });

    if (!response || response.status !== 200) {
      throw new Error(`Failed to download file. Status: ${response.status}`);
    }

    // ✅ Extract filename from content-disposition
    const contentDisposition = response.headers["content-disposition"];
    let extractedFileName = fileName;

    if (contentDisposition && contentDisposition.includes("filename=")) {
      const match = contentDisposition.match(/filename="?(.+?)"?$/);
      if (match && match[1]) {
        extractedFileName = match[1];
      }
    }

    // ✅ Set correct MIME type
    const contentType =
      response.headers["content-type"] ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const blob = new Blob([response.data], { type: contentType });

    // ✅ Create link and download
    const fileURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", extractedFileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (error) {
    console.error("Download API error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to download file",
    };
  }
};
