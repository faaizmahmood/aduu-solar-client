import axios from "axios";
import Cookies from "js-cookie";
// import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // ⏱️ 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 Add a request interceptor to include the token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ❌ Add a response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "Something went wrong. Please try again.";

        // Handle timeout
        if (error.code === "ECONNABORTED") {
            errorMessage = "Request timed out. Please try again.";
        }
        // Handle no response (network/server down)
        else if (!error.response) {
            errorMessage = "Unable to connect to the server. Please check your internet connection.";
        }
        // Handle server response with error
        else {
            errorMessage = error.response?.data?.message || errorMessage;
        }

        // 🎯 Optional: show global toast (if not handled locally)
        // toast.error(errorMessage);

        // Reject with enriched error
        return Promise.reject({ ...error, message: errorMessage });
    }
);

// 🚀 API Methods
const apiService = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data) => apiClient.post(url, data),
    put: (url, data) => apiClient.put(url, data),
    delete: (url) => apiClient.delete(url),
};

export default apiService;
