import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiService from "../../../utils/apiClient";

const useManageTeam = () => {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [staffData, setStaffData] = useState([]);

    // Fetch all staff members from API
    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            try {
                const response = await apiService.get("/get/all-staff");

                // Transform API response to match DataGrid format
                const formattedStaff = response.data.staff.map((staff) => ({
                    id: staff._id, // Use MongoDB ID as unique identifier
                    name: staff.name,
                    role: staff.workingRole || "Not Assigned", // Handle null role
                    email: staff.email,
                    phone: staff.phone,
                    status: staff.status,
                    projectsAssigned: staff.projectAssigned || 0, // Fixed typo
                    dateAdded: new Date(staff.createdAt).toISOString().split("T")[0], // Format date
                }));

                setStaffData(formattedStaff);
            } catch (error) {
                console.error("Fetch Staff Error:", error);
                toast.error("Failed to fetch staff data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);


    // Open Modal
    const openModal = () => setShowModal(true);

    // Close Modal
    const closeModal = () => setShowModal(false);

    // **API: Add Staff Member**
    const addStaff = async (newStaff) => {
        setLoading(true);
        try {
            const response = await apiService.post("/add/add-staff", newStaff);

            toast.success(response.data.message || "Staff member added successfully!");

            // **Update UI with new staff**
            const newStaffMember = {
                id: response.data.staff._id, // Get ID from API response
                name: newStaff.name,
                role: newStaff.workingRole || "Not Assigned",
                email: newStaff.email,
                phone: newStaff.phone,
                status: newStaff.status,
                projectsAssigned: newStaff.projectAssigned || 0, // Fixed typo
                dateAdded: new Date().toISOString().split("T")[0],
            };

            setStaffData([...staffData, newStaffMember]);

            return true;
        } catch (error) {
            console.error("Add Staff Error:", error);
            toast.error(error.response?.data?.message || "Failed to add staff member.");
            return false;
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "role", headerName: "Role", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "phone", headerName: "Phone", width: 150 },
        { field: "status", headerName: "Status", width: 100 },
        { field: "projectsAssigned", headerName: "Projects Assigned", width: 180 },
        { field: "dateAdded", headerName: "Date Added", width: 150 },
    ];

    const filteredRows = staffData.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    return {
        closeModal,
        showModal,
        setSearch,
        filteredRows,
        columns,
        openModal,
        addStaff,
        setShowPassword,
        showPassword,
        loading
    };
};

export default useManageTeam;
