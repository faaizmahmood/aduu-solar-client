import styles from "./projects.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import useProjects from "./useProjects";
import Loading from "../../../components/loading/loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminProjects = () => {
    const {
        loading,
        filteredProjects,
        setSearchTerm,
        searchTerm
    } = useProjects();

    const navigate = useNavigate();

    const handleProjectClick = (project) => {
        if (project?.status === "Pending") {
            toast.warn("Project service is not available.");
        } else if (project?.status === "In Progress") {
            navigate(`/projects/project-details/${project?._id}`);
        } else if (project?.status === "Awaiting Assignment") {
            toast.info("Awaiting staff assignment.");
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.projects}>
                    <div className="mt-3">
                        <div className="row">
                            <div className="col-6"></div>

                            <div className="col-6">
                                <input
                                    type="text"
                                    placeholder="Search Projects"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <AnimatePresence>
                            {filteredProjects.length === 0 ? (
                                <h3 className="text-center mt-5">No Projects Found</h3>
                            ) : (
                                filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={index}
                                        className="col-4 p-2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        onClick={() => handleProjectClick(project)}
                                    >
                                        <div className={styles.serviceItem}>
                                            <h3>{project?.projectName}</h3>
                                            <h5>Address: {project?.siteAddress}</h5>
                                            <h6>Status: {project?.status}</h6>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            )}
        </>
    );
};

export default AdminProjects;
