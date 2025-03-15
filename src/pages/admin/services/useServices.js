import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useService = () => {
    const [services, setServices] = useState([]); // Initialize as an empty array

    useEffect(() => {
        const fetchServices = async () => {
            try {
                NProgress.start();
                const token = Cookies.get("authToken");

                const response = await axios.get(`${API_BASE_URL}/service/get-service`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setServices(response.data.services);
                }

            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error(
                    error.response?.data?.message || "An unexpected error occurred. Please try again."
                );

            } finally {
                NProgress.done();
            }
        };

        fetchServices(); // Call the async function
    }, []);


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            console.log("Deleted service:", id);
            // Add delete logic here
        }
    };

    return {
        services,
        handleDelete 
    };
};

export default useService;
