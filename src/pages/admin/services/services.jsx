import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./services.module.scss";
import useService from "./useServices";
import Loading from "../../../components/loading/loading";
import Model from "../../../components/model/model";
import { PulseLoader } from "react-spinners";

function Services() {
    const {
        services,
        loading,
        showModal,
        selectedService,
        handleClose,
        handleOpen,
        deleteService,
        deleteLoading
    } = useService();

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.services}>
                    <div className="text-end">
                        <NavLink to="/services/add-service">
                            <button className="simple-btn">Add New Service</button>
                        </NavLink>
                    </div>

                    <div className="row mt-4">
                        <AnimatePresence>
                            {services?.length > 0 ? (
                                services.map((service, ind) => (
                                    <motion.div
                                        key={service._id || ind}
                                        className="col-4 p-2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    >
                                        <div className={styles.serviceItem}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3>
                                                    {ind + 1}. {service?.serviceName}{" "}
                                                    <span>(${service?.defaultPrice})</span>
                                                </h3>

                                                {/* Action Menu */}
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        as={CustomToggle}
                                                        id={`dropdown-${service._id}`}
                                                    />
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            as={NavLink}
                                                            to={`/services/edit-service/${service._id}`}
                                                        >
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleOpen(service)}
                                                            className="text-danger"
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>

                                            {service?.intakeForm?.length > 0 && (
                                                <h5 className="mt-2">
                                                    {service.intakeForm.map((field) => field.label).join(", ")}
                                                </h5>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    className="col-12 text-center mt-4"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <h4>No services available. Please add a new service.</h4>
                                    <NavLink to="/services/add-service">
                                        <button className="simple-btn mt-2">Add Service</button>
                                    </NavLink>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Delete Confirmation Modal */}
                    <Model showModal={showModal} handleClose={handleClose}>
                        <h3>Are you sure you want to delete this service?</h3>
                        {selectedService && (
                            <h5 className="text-danger">
                                {selectedService.serviceName} (${selectedService.defaultPrice})
                            </h5>
                        )}

                        <div className="btn-group d-flex gap-4 justify-content-center mt-4">
                            <button className="rounded-btn" onClick={deleteService}>
                                {deleteLoading ? <PulseLoader color="#1A1E34" size={5} /> : "Delete"}
                            </button>
                            <button className="simple-btn" onClick={handleClose}>
                                Cancel
                            </button>
                        </div>
                    </Model>
                </section>
            )}
        </>
    );
}

// Custom toggle component for dropdown menu
// eslint-disable-next-line react/prop-types
const CustomToggle = ({ onClick }) => {
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className={styles.actionIcon}
            style={{ cursor: "pointer", display: "inline-block" }}
        >
            <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
    );
};

export default Services;
