import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import styles from './manageTeam.module.scss';
import { motion, AnimatePresence } from "framer-motion";
import useManageTeam from "./useManageTeam";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BeatLoader } from "react-spinners";

const ManageTeam = () => {
    const {
        closeModal,
        showModal,
        setSearch,
        filteredRows,
        columns,
        openModal,
        addStaff,
        setShowPassword,
        showPassword,
        loading,
        fetching
    } = useManageTeam();

    return (
        <>
            <section className={styles.manageTeam}>
                {/* <h3>Manage Team</h3> */}

                <div className="mt-5">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4>All Users ({filteredRows.length})</h4>
                        </div>

                        <div className="col-6">
                            <div className="row">
                                <div className="col-8">
                                    <input
                                        onChange={(e) => setSearch(e.target.value)}
                                        type="text"
                                        className="mb-3"
                                        placeholder="Search"
                                    />
                                </div>

                                <div className="col-4">
                                    <button className="simple-btn w-100" onClick={openModal}>
                                        <i className="fa-regular fa-plus me-1"></i> Add User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.dataGrid}>
                        <Box sx={{ height: 400, width: "100%" }}>
                            {fetching ? (
                                <div className="text-center mt-4">
                                    <BeatLoader color="#36d7b7" />
                                </div>
                            ) : (
                                <DataGrid rows={filteredRows} columns={columns} pageSize={5} />
                            )}
                        </Box>
                    </div>
                </div>

                {/* Animated Modal */}
                <AnimatePresence>
                    {showModal && (
                        <>
                            <motion.div
                                className={"modalBackdrop"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeModal}
                            />

                            <motion.div
                                className={"modalContent"}
                                initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                                exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <h3>Create Staff Account</h3>

                                {/* Form */}
                                <Formik
                                    initialValues={{
                                        name: "",
                                        email: "",
                                        workingRole: "",
                                        phone: "",
                                        password: "",
                                        status: "Active",
                                    }}
                                    validationSchema={Yup.object({
                                        name: Yup.string().required("Name is required"),
                                        email: Yup.string().email("Invalid email").required("Email is required"),
                                        workingRole: Yup.string().required("Role is required"),
                                        phone: Yup.string().required("Phone is required"),
                                        password: Yup.string()
                                            .min(6, "Password must be at least 6 characters")
                                            .required("Password is required"),

                                    })}
                                    onSubmit={async (values, { resetForm }) => {
                                        const success = await addStaff(values);
                                        if (success) {
                                            resetForm();
                                            closeModal();
                                        }
                                    }}
                                >
                                    <Form className="text-start">
                                        <div className={`${styles.form_group} text-start`}>
                                            <label>Name</label>
                                            <Field type="text" name="name" className="form-control mt-2" />
                                            <ErrorMessage name="name" component="div" className="error" />
                                        </div>

                                        <div className={`${styles.form_group} text-start mt-3`}>
                                            <label>Email</label>
                                            <Field type="email" name="email" className="form-control  mt-2" />
                                            <ErrorMessage name="email" component="div" className="error" />
                                        </div>

                                        <div className={`${styles.form_group} text-start mt-3`}>
                                            <label>Role</label>
                                            <Field as="select" name="workingRole" className="form-control mt-2">
                                                <option value="">Select Role</option>
                                                <option value="Engineer">Engineer</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Technician">Technician</option>
                                            </Field>
                                            <ErrorMessage name="role" component="div" className="error" />
                                        </div>

                                        <div className={`${styles.form_group} text-start mt-3`}>
                                            <label>Phone</label>
                                            <Field type="text" name="phone" className="form-control mt-2" />
                                            <ErrorMessage name="phone" component="div" className="error" />
                                        </div>

                                        <div className={`${styles.form_group} text-start mt-3`}>
                                            <label>Password</label>
                                            <div className="position-relative">
                                                <Field
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    className="form-control mt-2"
                                                />
                                                <span
                                                    className={`${styles.password_toggle}`}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                                </span>
                                            </div>
                                            <ErrorMessage name="password" component="div" className="error" />
                                        </div>

                                        {/* <div className={`${styles.form_group} text-start mt-3`}>
                                            <label>Confirm Password</label>
                                            <Field type="password" name="confirmPassword" className="form-control mt-2" />
                                            <ErrorMessage name="confirmPassword" component="div" className="error" />
                                        </div> */}

                                        <button type="submit" className="simple-btn w-100 mt-4">{loading ? <BeatLoader size={8} color="#fff" /> : "Add Staff"}</button>
                                    </Form>
                                </Formik>

                                <motion.span
                                    className={"closeBtn"}
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
        </>
    );
};

export default ManageTeam;
