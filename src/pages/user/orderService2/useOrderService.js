/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NProgress from "nprogress";

import Cookies from "js-cookie";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useOrderService = () => {


    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(false);

    // Fetch all services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
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
                setLoading(false);
            }
        };

        fetchServices(); // Call the async function
    }, []);


    return {
        loading,
        services
    };
};

export default useOrderService;
