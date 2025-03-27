import { useEffect, useState } from "react";
import apiService from "../../../utils/apiClient";
import { toast } from "react-toastify";
import NProgress from "nprogress";

const useProjects = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [assignedStaffFilter, setAssignedStaffFilter] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [budgetFilter, setBudgetFilter] = useState("");
    const [projectTypeFilter, setProjectTypeFilter] = useState("");
    const [serviceCategoryFilter, setServiceCategoryFilter] = useState("");

    // Modal
    const [model, setModel] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Fetch Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                NProgress.start();
                setLoading(true);
                const response = await apiService.get("/project/get-projects");

                if (response.status === 200) {
                    setProjects(response.data.projects);
                    setServices(response.data.services);
                } else {
                    toast.error("Failed to fetch projects");
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("Internal Server Error");
            } finally {
                setLoading(false);
                NProgress.done();
            }
        };

        fetchProjects();
    }, []);

    // Function to filter projects
    useEffect(() => {
        const filterProjects = () => {
            const filtered = projects.filter((project) => {
                const matchesSearch = !searchTerm || project?.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = !statusFilter || project?.status?.toLowerCase() === statusFilter.toLowerCase();
                const matchesStaff = !assignedStaffFilter || (project?.assignedStaff?.some(staff => staff.name.toLowerCase().includes(assignedStaffFilter.toLowerCase())));
                const matchesCompany = !companyFilter || project?.companyId?.toLowerCase().includes(companyFilter.toLowerCase());
                const matchesBudget = !budgetFilter || (project?.budget && project.budget >= parseFloat(budgetFilter));
                const matchesProjectType = !projectTypeFilter || project?.projectType?.toLowerCase().includes(projectTypeFilter.toLowerCase());

                const matchesServiceCategory = !serviceCategoryFilter ||
                    (Array.isArray(project?.order?.services) &&
                        project.order.services.some(service =>
                            service?.serviceName?.toLowerCase().includes(serviceCategoryFilter.toLowerCase())
                        ));

                // Date Range Filtering
                const projectDate = new Date(project?.createdAt);
                const startDate = startDateFilter ? new Date(startDateFilter) : null;
                const endDate = endDateFilter ? new Date(endDateFilter) : null;

                const matchesStartDate = !startDate || projectDate >= startDate;
                const matchesEndDate = !endDate || projectDate <= endDate;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesStaff &&
                    matchesCompany &&
                    matchesBudget &&
                    matchesProjectType &&
                    matchesServiceCategory &&
                    matchesStartDate &&
                    matchesEndDate
                );
            });

            setFilteredProjects(filtered);
        };

        filterProjects();
    }, [
        projects,
        searchTerm,
        statusFilter,
        assignedStaffFilter,
        companyFilter,
        startDateFilter,
        endDateFilter,
        budgetFilter,
        projectTypeFilter,
        serviceCategoryFilter,
        services
    ]);

    // Modal Functions
    const handleModelClose = () => setModel(false);
    const handleModelOpen = (project) => {
        setSelectedProject(project);
        setModel(true);
    };

    // Function to return status color
    const getStatusColor = (status) => {
        if (!status || typeof status !== "string") {
            return "gray"; // Default color
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

    const removeFilter = (filterType) => {
        switch (filterType) {
            case "search":
                setSearchTerm("");
                break;
            case "status":
                setStatusFilter("");
                break;
            case "staff":
                setAssignedStaffFilter("");
                break;
            case "company":
                setCompanyFilter("");
                break;
            case "startDate":
                setStartDateFilter("");
                break;
            case "endDate":
                setEndDateFilter("");
                break;
            case "budget":
                setBudgetFilter("");
                break;
            case "projectType":
                setProjectTypeFilter("");
                break;
            case "serviceCategory":
                setServiceCategoryFilter("");
                break;
            default:
                break;
        }
    };


    // Function to get active filters
    const getActiveFilters = () => {
        return [
            searchTerm && { label: `Search: ${searchTerm}`, type: "search" },
            statusFilter && { label: `Status: ${statusFilter}`, type: "status" },
            assignedStaffFilter && { label: `Staff: ${assignedStaffFilter}`, type: "staff" },
            companyFilter && { label: `Company: ${companyFilter}`, type: "company" },
            startDateFilter && { label: `Start Date: ${startDateFilter}`, type: "startDate" },
            endDateFilter && { label: `End Date: ${endDateFilter}`, type: "endDate" },
            budgetFilter && { label: `Budget: ${budgetFilter}`, type: "budget" },
            projectTypeFilter && { label: `Project Type: ${projectTypeFilter}`, type: "projectType" },
            serviceCategoryFilter && { label: `Service: ${serviceCategoryFilter}`, type: "serviceCategory" },
        ].filter(Boolean);
    };

    return {
        loading,
        projects,
        filteredProjects,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        assignedStaffFilter,
        setAssignedStaffFilter,
        companyFilter,
        setCompanyFilter,
        startDateFilter,
        setStartDateFilter,
        endDateFilter,
        setEndDateFilter,
        budgetFilter,
        setBudgetFilter,
        projectTypeFilter,
        setProjectTypeFilter,
        serviceCategoryFilter,
        setServiceCategoryFilter,
        model,
        handleModelClose,
        handleModelOpen,
        getStatusColor,
        selectedProject,
        removeFilter,
        getActiveFilters,
        services
    };
};

export default useProjects;
