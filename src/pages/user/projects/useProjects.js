import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import NProgress from "nprogress";

const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch projects from the backend
    const fetchProjects = async () => {
        setLoading(true);
        setError("");
        NProgress.start();

        try {

            const token = Cookies.get("authToken");

            const response = await axios.get("http://localhost:5000/api/project/client-projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProjects(response.data.projects); // Update project state

        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err.response?.data?.message || "Failed to fetch projects");
        } finally {
            setLoading(false);
            NProgress.done();
        }
    };

    // Open Modal
    const openModal = () => setShowModal(true);

    // Close Modal
    const closeModal = () => setShowModal(false);

    // Handle Form Submission
    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);
        setError("");

        try {
            const token = Cookies.get("authToken");

            const response = await axios.post(
                "http://localhost:5000/api/project/create-project",
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Project Created!");

            // Update state with the new project
            setProjects([...projects, response.data]);

            resetForm();
            closeModal();
        } catch (err) {
            console.error("Error creating project:", err);
            toast.error("Error creating project");
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    // Fetch projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []);


    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "green";
            case "in progress":
                return "orange";
            case "pending":
                return "red";
            default:
                return "gray";
        }
    };

    return {
        projects,
        showModal,
        openModal,
        closeModal,
        handleSubmit,
        fetchProjects,
        loading,
        error,
        getStatusColor
    };
};

export default useProjects;
