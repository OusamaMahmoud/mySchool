import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://localhost:7272/api",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // No token found, redirect to login or handle it gracefully
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
        return Promise.reject(
          new Error("No auth token, redirecting to login.")
        );
      }
    }
    return config;
  },
  (error) => {
    // Ensure the rejection reason is an Error object
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

let isRedirecting = false;

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isRedirecting && !window.location.pathname.includes("/login")) {
        isRedirecting = true;
        localStorage.removeItem("auth");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);
