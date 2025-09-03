// src/axiosConfig.js
import axios from "axios";
import { Toaster } from "../../common/alertComponets/Toaster";

const axiosInstance = axios.create({
  // Your base URL or other configuration
  headers: {
    Authorization: `${localStorage.getItem("jwtToken")}`,
    timeout: 5000,
  },
});

const setupInterceptors = (setLoading) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = token;
      }
      setLoading(true);
      return config;
    },
    (error) => {
      setLoading(false);
      throw error;
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    (error) => {
      setLoading(false);
      Toaster("error", "Something went wrong");
      throw error;
    }
  );
};

export { axiosInstance, setupInterceptors };
