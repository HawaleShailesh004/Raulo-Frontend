import axios from "axios";

// Create an axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor (for attaching tokens, etc.)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor (for global error handling)
axiosClient.interceptors.response.use(
  (response) => response.data, // unwrap data automatically
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired, redirect to login or refresh token
        console.warn("Unauthorized! Redirecting...");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
