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

    const [selectedStaff, setSelectedStaff] = useState([]);

    const navigate = useNavigate()


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
                    toast.error("Failed to fetch project details");
                    setError("Failed to fetch project details");
                }

                // Fetch staff list
                const staffResponse = await apiService.get(`/get/all-staff`);
                if (staffResponse.status === 200) {

                    const formattedStaff = staffResponse.data.staff.map((staff) => ({
                        _id: staff._id, // Use MongoDB ID as unique identifier
                        name: staff.name,
                        role: staff.workingRole || "Not Assigned", // Handle null role
                        email: staff.email,
                        phone: staff.phone,
                        status: staff.status,
                        projectsAssigned: staff.projectAssigned || 0, // Fixed typo
                        dateAdded: new Date(staff.createdAt).toISOString().split("T")[0], // Format date
                    }));

                    const ActiveStaff = formattedStaff.filter((member) => {
                        return member.status === "Active"
                    })

                    setStaffList(ActiveStaff || []);
                } else {
                    toast.error("Failed to fetch staff list");
                    setError("Failed to fetch staff list");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Internal Server Error");
                setError("Internal Server Error");
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

    // Toggle staff selection (ensuring UI changes correctly)
    const handleSelectStaff = (staff) => {
        setSelectedStaff((prev) => {
            const isAlreadySelected = prev.find((s) => s._id === staff._id);
            if (isAlreadySelected) {
                return prev.filter((s) => s._id !== staff._id); // Remove if already selected
            } else {
                return [...prev, staff]; // Add if not selected
            }
        });
    };

    const handleAssignStaff = async () => {
        if (selectedStaff.length === 0) {
            toast.error("Please select at least one staff member to assign.");
            return;
        }

        // ✅ Check if project exists
        if (!project) {
            toast.error("Project data is not available.");
            return;
        }

        // ✅ Filter out staff members that are already assigned
        const assignedStaffIds = new Set(project.assignedStaff?.map(staff => staff._id) || []);
        const newStaff = selectedStaff.filter(staff => !assignedStaffIds.has(staff._id));

        if (newStaff.length === 0) {
            toast.error("All selected staff members are already assigned.");
            return;
        }

        try {
            NProgress.start();

            const payload = {
                projectId: project._id,  // Ensure project ID is included
                staffIds: newStaff.map(staff => staff._id) // Only send new staff IDs
            };

            const response = await apiService.post("/staff/assign-staff", payload);

            if (response.status === 200) {
                toast.success("Staff assigned successfully!");

                // ✅ Update project state with new assigned staff
                setProject((prev) => ({
                    ...prev,
                    assignedStaff: [...prev.assignedStaff, ...newStaff] // Add only new staff
                }));

                setSelectedStaff([]); // Clear selection after successful assignment
                navigate('/projects')
            } else {
                toast.error(response.data.message || "Failed to assign staff.");
            }
        } catch (error) {
            console.error("Error assigning staff:", error);
            toast.error("Internal server error.");
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
        handleSelectStaff,
        handleAssignStaff,
        selectedStaff,
        setSelectedStaff
    };
};

export default useAssignProjects;
