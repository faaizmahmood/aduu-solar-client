import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../../utils/apiClient";
import { useSelector } from "react-redux";
import NProgress from "nprogress";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const useCompany = () => {

    const [loading, setLoading] = useState(false);

    const [companyData, setCompanyData] = useState([]);

    const [companyMembers, setCompanyMembers] = useState([]);

    const [formsubmissionLoading, setFormsubmissionLoading] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");

    const [triggerAPI, setTriggerAPI] = useState(false);

    const [model, setModel] = useState(false)

    const currentUser = useSelector((state) => state.user.user);

    const companyId = currentUser?.companyId;

    const handleModelClose = () => setModel(false)

    const handleModelOpen = () => setModel(true)

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            if (!companyId) return;

            setLoading(true);
            try {
                NProgress.start();
                const response = await apiService.get(`/company/company-details/${companyId}`);
                setCompanyData(response.data.company);
                setCompanyMembers(response.data.members);
            } catch (error) {
                console.error("Company Fetch Error:", error.response?.data || error.message);

                // Show toast notification for errors
                toast.error(error.response?.data?.message || "Failed to fetch company details");
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };

        fetchCompanyDetails();
    }, [companyId, triggerAPI]);


    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit"
        });
    };


    // Dynamically create rows based on API response
    const rows = companyMembers?.map((member) => ({
        id: member._id,
        name: member.name,
        role: member.companyRole || "Not Assigned",
        email: member.email,
        status: "Active",
    })) || [];

    const columns = [
        { field: 'id', headerName: 'ID', width: 250 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];


    // Filter rows based on search query
    const filteredRows = rows.filter(
        (row) =>
            row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.status.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Formik for Adding New Staff
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            // role: '',
            companyRole: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            // role: Yup.string().required('Role is required'),
            companyRole: Yup.string(),
        }),
        onSubmit: async (values, { resetForm }) => {

            const userPayload = {
                name: values.name,
                email: values.email,
                password: values.password,
                companyRole: values.companyRole,
                companyId: currentUser.companyId
            }

            try {
                setFormsubmissionLoading(true)
                const response = await apiService.post('/auth/signup', userPayload);
                toast.success(response.data.message || 'User registered successfully!'); // Use backend message
                resetForm();
                handleModelClose(); // Close modal on success
            } catch (error) {
                console.error('Error adding staff:', error);
                toast.error(error.response?.data?.message || 'Failed to add staff'); // Use backend message
            } finally {
                setFormsubmissionLoading(false)
                setTriggerAPI(!triggerAPI)
            }
        }

    });

    return {
        loading,
        companyData,
        companyMembers,
        formatDate,
        rows,
        columns,
        setSearchQuery,
        filteredRows,
        searchQuery,
        model,
        handleModelClose,
        handleModelOpen,
        formik,
        formsubmissionLoading
    };
};

export default useCompany;
