import styles from "./projects.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useProjects from "./useProjects";
import Loading from "../../../components/loading/loading";
import Model from "../../../components/model/model";
import { FaFilter } from "react-icons/fa"; // Filter Icon
import { useNavigate } from "react-router-dom";

const AdminProjects = () => {

    const navigate = useNavigate()

    const {
        loading,
        filteredProjects,
        setSearchTerm,
        searchTerm,
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
    } = useProjects();

    const [showFilters, setShowFilters] = useState(false);

    const activeFilters = getActiveFilters();


    const renderFieldValue = (value) => {
        if (typeof value === "string" && value.startsWith("http")) {
            return (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary">
                    {value}
                </a>
            );
        }
        return value ?? <span className="text-muted">N/A</span>;
    };


    const renderProjectDetails = () => {
        if (!selectedProject) return <h5 className="text-muted">N/A</h5>;

        switch (selectedProject.status) {
            case "Pending":
                return <h5 className="fw-bold" style={{ color: getStatusColor(selectedProject?.status) }}>Pending - No service ordered yet.</h5>;

            case "Awaiting Assignment":
                return (
                    <div>
                        <h5 className="fw-bold" style={{ color: getStatusColor(selectedProject?.status) }}>
                            Awaiting Staff - Services ordered, but staff not assigned.
                        </h5>
                        <button className="simple-btn my-3" onClick={() => {
                            navigate(`/projects/assign-staff/${selectedProject?._id}`)
                        }}>Assign Staff</button>
                    </div>
                );

            case "In Progress":
                return (
                    <div>
                        <h5 className="fw-bold" style={{ color: getStatusColor(selectedProject?.status) }}>In Progress</h5>
                        <button className="rounded-btn my-3">View Details</button>
                    </div>
                );

            case "Completed":
                return <h5 className="fw-bold text-success">Project Completed</h5>;

            default:
                return <h5 className="text-muted">N/A</h5>;
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.projects}>

                    {activeFilters.length > 0 && (
                        <div className="alert d-flex flex-wrap gap-2">
                            {activeFilters.map((filter, index) => (
                                <span key={index} className="d-flex align-item-center badge bg-secondary p-2">
                                    <span>{filter.label}</span>
                                    <i className="fa-regular fa-xmark ms-2" style={{ cursor: 'pointer' }} onClick={() => removeFilter(filter.type)}></i>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Filter Button */}

                    <div className="row">

                        <div className="col-md-6">

                        </div>
                        <div className="col-md-4 text-end">
                            <input
                                type="text"
                                placeholder="Search Projects"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-2">

                            <div className="d-flex justify-content-end mb-3">
                                <button className="rounded-btn w-100" onClick={() => setShowFilters(!showFilters)}>
                                    <FaFilter /> Filters
                                </button>
                            </div>
                        </div>

                    </div>


                    {/* Filters Section (Show/Hide on Click) */}
                    {showFilters && (
                        <div className="card p-3 mb-3">
                            <div className="row">

                                <div className="col-md-3 my-2">
                                    <select
                                        className="form-control"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Awaiting Assignment">Awaiting Assignment</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div className="col-md-3 my-2">
                                    <input
                                        type="text"
                                        placeholder="Filter by Staff"
                                        value={assignedStaffFilter}
                                        onChange={(e) => setAssignedStaffFilter(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3 my-2">
                                    <input
                                        type="text"
                                        placeholder="Filter by Company"
                                        value={companyFilter}
                                        onChange={(e) => setCompanyFilter(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3 my-2">
                                    <input
                                        type="number"
                                        placeholder="Project Budget (Min)"
                                        value={budgetFilter}
                                        onChange={(e) => setBudgetFilter(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3 my-2">
                                    <input
                                        type="date"
                                        value={startDateFilter}
                                        onChange={(e) => setStartDateFilter(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3 my-2">
                                    <input
                                        type="date"
                                        value={endDateFilter}
                                        onChange={(e) => setEndDateFilter(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3 my-2">
                                    <input
                                        type="text"
                                        placeholder="Project Type"
                                        value={projectTypeFilter}
                                        onChange={(e) => setProjectTypeFilter(e.target.value)}
                                        className="form-control"
                                    />
                                </div>

                                <div className="col-md-3 my-2">
                                    <select
                                        className="form-control"
                                        value={serviceCategoryFilter}
                                        onChange={(e) => setServiceCategoryFilter(e.target.value)}
                                    >
                                        <option value="">All Services</option>
                                        {
                                            services.map((ele, ind) => {
                                                return (
                                                    <>
                                                        <option key={ind} value={ele.serviceName}>{ele.serviceName}</option>
                                                    </>
                                                )
                                            })
                                        }
                                        {/* <option value="">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Awaiting Assignment">Awaiting Assignment</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option> */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row mt-3">
                        <AnimatePresence>
                            {filteredProjects.length === 0 ? (
                                <h3 className="text-center text-muted mt-5">No Projects Found</h3>
                            ) : (
                                filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        className="col-4 p-2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        onClick={() => handleModelOpen(project)}
                                    >
                                        <div className={`${styles.serviceItem}`}>
                                            <h3>{project?.projectName ?? "N/A"}</h3>
                                            <h4>Address: {project?.siteAddress ?? "N/A"}</h4>
                                            <h5 style={{ color: getStatusColor(project?.status) }}>
                                                Status: {project?.status ?? "N/A"}
                                            </h5>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            )}

            <Model showModal={model} handleClose={handleModelClose}>
                <h3 className="fw-bold">Project Details</h3>

                <div className={`${styles.model_contant} text-start`}>
                    <h5 className="fw-bold">Project Name: <span className="text-secondary">{selectedProject?.projectName ?? "N/A"}</span></h5>
                    <h5 className="fw-bold">Company Name: <span className="text-secondary">{selectedProject?.companyId ?? "N/A"}</span></h5>
                    <h5 className="fw-bold">Client Name: <span className="text-secondary">{selectedProject?.siteOwner ?? "N/A"}</span></h5>
                    <h5 className="fw-bold">Site Address: <span className="text-secondary">{selectedProject?.siteAddress ?? "N/A"}</span></h5>

                    {/* Render status-based content */}
                    <div className="my-3">
                        {renderProjectDetails()}
                    </div>

                    <h5>Assigned Staff:{" "}
                        <span>
                            {selectedProject?.assignedStaff?.length > 0
                                ? selectedProject.assignedStaff.map((ele) => ele.name).join(", ")
                                : "N/A"}
                        </span>
                    </h5>

                    {selectedProject?.order?.services?.length > 0 && (
                        <>
                            <h3 className="fw-bold mt-4">Ordered Services Details</h3>
                            {selectedProject.order.services.map((service, index) => (
                                <div key={index} className="border rounded p-3 my-3">
                                    <h5 className="fw-bold">{service.serviceName ?? "N/A"}</h5>
                                    {service.formResponses?.length > 0 ? (
                                        service.formResponses.map((response, i) => (
                                            <h5 key={i} className="text-secondary">
                                                {response.fieldName ?? "N/A"}: {renderFieldValue(response.fieldValue)}
                                            </h5>
                                        ))
                                    ) : (
                                        <h5 className="text-muted">N/A</h5>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </Model>
        </>
    );
};

export default AdminProjects;
