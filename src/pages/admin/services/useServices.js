import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useService = () => {

    const [services, setServices] = useState([]); // List of services

    const [loading, setLoading] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [selectedService, setSelectedService] = useState(null); // Track selected service

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

    // Open delete confirmation modal
    const handleOpen = (service) => {
        setSelectedService(service);
        setShowModal(true);
    };

    // Close delete modal
    const handleClose = () => {
        setShowModal(false);
        setSelectedService(null);
    };

    // Delete service function
    const deleteService = async () => {
        if (!selectedService) return;

        try {
            setDeleteLoading(true);
            NProgress.start();
            const token = Cookies.get("authToken");

            const response = await axios.delete(`${API_BASE_URL}/service/delete-service/${selectedService._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Service deleted successfully!");
                setServices(services.filter((s) => s._id !== selectedService._id));
                handleClose(); // Close modal
            }

        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete service."
            );

        } finally {
            NProgress.done();
            setDeleteLoading(false);
        }
    };

    return {
        services,
        loading,
        showModal,
        selectedService,
        handleClose,
        handleOpen,
        deleteService,
        deleteLoading
    };
};

export default useService;
