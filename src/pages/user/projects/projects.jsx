/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useProjects from "./useProjects";
import styles from "./projects.module.scss";
import { PulseLoader } from "react-spinners";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
    projectName: Yup.string().min(3, "Too Short!").required("Project Name is required"),
    siteAddress: Yup.string().required("Site Address is required"),
    siteOwner: Yup.string().required("Site Owner Name is required"),
});

const UserProjects = () => {
    const { showModal, openModal, closeModal, handleSubmit, projects, fetchProjects, getStatusColor } = useProjects();

    useEffect(() => {
        fetchProjects();
    }, []);

    const navigate = useNavigate()

    console.log("Projects Data:", projects); // Debugging

    return (
        <section className={styles.projects}>
            <div className={styles.userProjects}>

                <AnimatePresence>
                    {projects.map((project) => (
                        <motion.div
                            key={project._id}
                            className={styles.projectItem}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            onClick={() =>
                                project.status === 'Pending'
                                    ? navigate(`/project/order-service/${project._id}`, { state: { project } })
                                    : navigate(`/project-details/${project._id}`, { state: { project } })
                            }

                        >
                            <div className={styles.folderTab}></div>
                            <div className={styles.folderBody}>
                                <h2>{project.projectName}</h2>
                            </div>
                            <div className={styles.statusContainer}>
                                <span className={styles.statusDot} style={{ backgroundColor: getStatusColor(project.status) }}></span>
                                <span>{project.status}</span>
                            </div>
                        </motion.div>
                    ))}


                </AnimatePresence>


                {/* Create New Project Button */}
                <div className={styles.addProject} onClick={openModal}>
                    <div className={styles.folderTab}></div>
                    <div className={styles.folderBody}>
                        <button className="simple-btn">Create new project</button>
                    </div>
                </div>
            </div>

            {/* Animated Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Modal Backdrop */}
                        <motion.div
                            className={styles.modalBackdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                        />

                        {/* Modal Box */}
                        <motion.div
                            className={styles.modalContent}
                            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <h3>Create a New Project</h3>

                            {/* Formik Form */}
                            <Formik
                                initialValues={{ projectName: "", siteAddress: "", siteOwner: "" }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <div className={`${styles.input_group} text-start mt-3`}>
                                            <label>Project Name</label>
                                            <Field type="text" name="projectName" placeholder="Project Name" className="mt-2" />
                                            <ErrorMessage name="projectName" component="div" className="error" />
                                        </div>

                                        <div className={`${styles.input_group} text-start mt-3`}>
                                            <label>Site Address</label>
                                            <Field type="text" name="siteAddress" placeholder="Site Address" className="mt-2" />
                                            <ErrorMessage name="siteAddress" component="div" className="error" />
                                        </div>

                                        <div className={`${styles.input_group} text-start mt-3`}>
                                            <label>Site Owner Name</label>
                                            <Field type="text" name="siteOwner" placeholder="Site Owner Name" className="mt-2" />
                                            <ErrorMessage name="siteOwner" component="div" className="error" />
                                        </div>

                                        <button type="submit" className="simple-btn mt-4" disabled={isSubmitting}>
                                            {isSubmitting ? <PulseLoader color="#ffffff" size={5} /> : "Create"}
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            {/* Close Button */}
                            <motion.span
                                className={styles.closeBtn}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={closeModal}
                            >
                                <i className="fa-regular fa-xmark mt-2"></i>
                            </motion.span>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default UserProjects;
