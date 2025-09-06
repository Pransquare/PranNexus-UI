import { Environment } from "../../../environments/Environment";
import { axiosInstance as axios } from "../../interceptor/useAxiosInterceptors";

export const createNews = async (newsEntity) => {
  try {
    const response = await axios.post(
      `${Environment.nemsUrl}/news`,
      newsEntity
    );
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

export const updateNews = async (newsId, updatedNewsEntity) => {
  try {
    const response = await axios.put(
      `${Environment.nemsUrl}/news/${newsId}`,
      updatedNewsEntity
    );
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

export const deleteNews = async (newsId) => {
  try {
    const response = await axios.delete(
      `${Environment.nemsUrl}/news/${newsId}`
    );
    return response.status === 204;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};

export const getAllNews = async () => {
  try {
    const response = await axios.get(`${Environment.nemsUrl}/news`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all news:", error);
    throw error;
  }
};

export const getNewsById = async (newsId) => {
  try {
    const response = await axios.get(`${Environment.nemsUrl}/news/${newsId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw error;
  }
};
