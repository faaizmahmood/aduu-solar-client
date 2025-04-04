import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import apiService from "../../../utils/apiClient";
import { useSelector } from "react-redux";

const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentUser = useSelector((state) => state.user.user);

    // Fetch projects from the backend
    const fetchProjects = async () => {
        setLoading(true);
        setError("");
        NProgress.start();

        try {
            const response = await apiService.get("/project/client-projects");
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

        // if (!currentUser?.companyId) {
        //     toast.error("Company ID is missing.");
        //     setLoading(false);
        //     return;
        // }

        const projectPayload = {
            projectName: values.projectName,
            siteAddress: values.siteAddress,
            siteOwner: values.siteOwner,
            description: "",
            companyId: currentUser.companyId || null
        }

        try {
            const response = await apiService.post("/project/create-project", projectPayload);

            if (response.status >= 200 && response.status < 300) {
                toast.success("Project Created!");

                // Refresh projects list after successful creation
                await fetchProjects();

                resetForm();
                closeModal();
            } else {
                throw new Error(response.data?.message || "Failed to create project");
            }
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
        if (!status || typeof status !== "string") {
            return "gray"; // Default color for missing/invalid status
        }

        switch (status.toLowerCase()) {
            case "completed":
                return "green";
            case "in progress":
                return "blue";
            case "awaiting assignment":
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
