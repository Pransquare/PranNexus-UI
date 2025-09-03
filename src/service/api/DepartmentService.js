import { axiosInstance as axios } from "../interceptor/useAxiosInterceptors";
import { Environment } from "../../environments/Environment";

const API_URL = Environment.apiUrl; // Replace with your actual API URL

export const CreateOrUpdateDepartment = async (payload) => {
	try {
		const response = await axios.post(
			`${API_URL}/departments/createOrUpdateDepartment`,
			payload
		);
		return response.data;
	} catch (error) {
		console.error("Error creating or updating department:", error);
		throw error;
	}
};

export const DedupeCheckWithDepartmentCode = async (departmentCode) => {
	try {
		const response = await axios.get(
			`${API_URL}/departments/dedupeCheckWithDepartmentCode/${departmentCode}`
		);
		return response.data;
	} catch (error) {
		console.error("Error checking department code:", error);
		throw error;
	}
};

export const DeleteDepartment = async (departmentId) => {
	try {
		const response = await axios.delete(
			`${API_URL}/departments/deleteDepartment/${departmentId}`
		);
		return response.data;
	} catch (error) {
		console.error("Error deleting department:", error);
		throw error;
	}
};

export const GetAllDepartments = async () => {
	try {
		const response = await axios.get(
			`${API_URL}/departments/getAllDepartments`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching departments:", error);
		throw error;
	}
};
