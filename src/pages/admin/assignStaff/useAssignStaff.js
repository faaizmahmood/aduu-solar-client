import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../../utils/apiClient";
import { toast } from "react-toastify";
import NProgress from "nprogress";

const useAssignProjects = () => {
    const { projectID } = useParams();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [error, setError] = useState(null);
    const [invoiceStatus, setInvoiceStatus] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjectAndStaff = async () => {
            if (!projectID) return;

            try {
                NProgress.start();
                setLoading(true);
                setError(null);

                // Fetch project details
                const projectResponse = await apiService.get(`/project/get-single-project/${projectID}`);
                if (projectResponse.status === 200) {
                    setProject(projectResponse.data.project);
                } else {
                    throw new Error("Failed to fetch project details");
                }

                // Fetch staff list
                const staffResponse = await apiService.get(`/get/all-staff`);
                if (staffResponse.status === 200) {
                    const formattedStaff = staffResponse.data.staff.map((staff) => ({
                        _id: staff._id,
                        name: staff.name,
                        role: staff.workingRole || "Not Assigned",
                        email: staff.email,
                        phone: staff.phone,
                        status: staff.status,
                        projectsAssigned: staff.projectAssigned || 0,
                        dateAdded: new Date(staff.createdAt).toISOString().split("T")[0],
                    }));

                    const activeStaff = formattedStaff.filter((member) => member.status === "Active");
                    setStaffList(activeStaff || []);
                } else {
                    throw new Error("Failed to fetch staff list");
                }

                setInvoiceStatus(projectResponse.data.invocie.status);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.message || "Internal Server Error");
                setError(error.message);
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };

        fetchProjectAndStaff();
    }, [projectID]);

    // Function to check if a value is a valid URL
    const isValidUrl = (value) => {
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
            // eslint-disable-next-line no-unused-vars
        } catch (_) {
            return false;
        }
    };

    // Toggle staff selection
    const handleSelectStaff = (staff) => {
        setSelectedStaff((prev) => {
            const isAlreadySelected = prev.find((s) => s._id === staff._id);
            return isAlreadySelected ? prev.filter((s) => s._id !== staff._id) : [...prev, staff];
        });
    };

    const handleAssignStaff = async () => {
        if (selectedStaff.length === 0) {
            toast.error("Please select at least one staff member to assign.");
            return;
        }

        // ✅ Restrict assignment if invoice status is "Pending Payment" or Overdue
        if (invoiceStatus === "Pending Payment" || invoiceStatus === "Overdue") {
            toast.error("Cannot assign staff. Invoice is pending payment or overdue.");
            return;
        }

        if (!project) {
            toast.error("Project data is not available.");
            return;
        }

        const assignedStaffIds = new Set(project.assignedStaff?.map(staff => staff._id) || []);
        const newStaff = selectedStaff.filter(staff => !assignedStaffIds.has(staff._id));

        if (newStaff.length === 0) {
            toast.error("All selected staff members are already assigned.");
            return;
        }

        try {
            NProgress.start();

            const payload = {
                projectId: project._id,
                staffIds: newStaff.map(staff => staff._id),
            };

            const response = await apiService.post("/staff/assign-staff", payload);

            if (response.status === 200) {
                toast.success("Staff assigned successfully!");
                setProject((prev) => ({
                    ...prev,
                    assignedStaff: [...prev.assignedStaff, ...newStaff],
                }));
                setSelectedStaff([]);
                navigate('/projects');
            } else {
                throw new Error(response.data.message || "Failed to assign staff.");
            }
        } catch (error) {
            console.error("Error assigning staff:", error);
            toast.error(error.message || "Internal server error.");
        } finally {
            NProgress.done();
        }
    };

    return {
        project,
        staffList,
        loading,
        error,
        isValidUrl,
        invoiceStatus,
        handleSelectStaff,
        handleAssignStaff,
        selectedStaff,
        setSelectedStaff
    };
};

export default useAssignProjects;
