import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token
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

// API Methods
const apiService = {
    get: (url, params = {}) => apiClient.get(url, { params }),
    post: (url, data) => apiClient.post(url, data),
    put: (url, data) => apiClient.put(url, data),
    delete: (url) => apiClient.delete(url),
};

// Export the API service
export default apiService;
