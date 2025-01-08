import axios from "axios";
import Cookies from "js-cookie";

const apiService = () => {

  // Create Axios instance
  const instance = axios.create({
    withCredentials: true, // Enable cookies for cross-site requests
    baseURL: process.env.REACT_APP_SERVER_BASE_URL, // Set your base URL here
  });

  // Request interceptor to set Authorization header
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("auth_token");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
      const { response } = error;

      if (response) {
        // alert(JSON.stringify(response.data));

        if (response.status === 401) {
          alert("Unauthorized access! Redirecting to login...");
          window.location.href = "/login"; // Redirect to login
        }
        
        else if (response.data) {
          // Handle Laravel validation errors or other error formats
          if (response.data.errors) {
            const validationMessages = Object.values(response.data.errors)
              .flat()
              .join("\n");
            alert(`Validation Errors:\n${validationMessages}`);
          }
          else if (response.data.message) {
            alert(response.data.message);
          }
          else if (response.data.error) {
            alert(response.data.error);
          }
        }

      }
      
      else {
        alert("Network error. Please check your connection.");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default apiService;
