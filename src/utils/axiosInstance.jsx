import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
