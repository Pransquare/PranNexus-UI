import { Environment } from "../../environments/Environment";
import { axiosInstance as axios } from "../interceptor/useAxiosInterceptors";

export const GetAllClients = async () => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/clients/getAllClients`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all clients:", error);
    throw error;
  }
};

export const DedupeClient = async (leaveCode) => {
  try {
    const response = await axios.get(
      `${Environment.apiUrl}/clients/dedupeClient/${leaveCode}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deduping client (${leaveCode}):`, error);
    throw error;
  }
};

export const CreateOrUpdateClient = async (payload) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/clients/createOrUpdateClient`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating or updating client:", error);
    throw error;
  }
};

export const DeleteClient = async (id) => {
  try {
    const response = await axios.post(
      `${Environment.apiUrl}/clients/deleteClient/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting client (${id}):`, error);
    throw error;
  }
};
