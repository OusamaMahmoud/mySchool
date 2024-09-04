import axios from "axios";
import { useNavigate } from "react-router-dom";

export const apiClient = axios.create({
  baseURL: "https://localhost:7272/api",
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage or any other place you store it
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("yyuyuyuyu");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      const navigate = useNavigate();

      navigate("/login");
    }
    return Promise.reject(error);
  }
);
