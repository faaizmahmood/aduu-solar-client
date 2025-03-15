import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap"; // Added Dropdown for actions menu
import styles from "./services.module.scss";
import useService from "./useServices";

function Services() {
    const { services, handleDelete  } = useService();

    return (
        <section className={styles.services}>
            <div className="text-end">
                <NavLink to="/services/add-service">
                    <button className="simple-btn">Add New Service</button>
                </NavLink>
            </div>

            <div className="row mt-4">
                {services?.length > 0 ? (
                    services.map((service, ind) => (
                        <div key={service._id || ind} className="col-4 p-2">
                            <div className={styles.serviceItem}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3>
                                        {ind + 1}. {service?.serviceName} <span>(${service?.defaultPrice})</span>
                                    </h3>

                                    {/* Action Menu */}
                                    <Dropdown>
                                        <Dropdown.Toggle as="div" className={styles.actionIcon} id={`dropdown-${service._id}`}>
                                            {/* <i className="fa-solid fa-ellipsis-vertical"></i> */}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item as={NavLink} to={`/services/edit/${service._id}`}>
                                                Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(service._id)} className="text-danger">
                                                Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </div>

                                {service?.intakeForm?.length > 0 && (
                                    <h5 className="mt-2">
                                        {service.intakeForm.map(field => field.label).join(", ")}
                                    </h5>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center mt-4">
                        <h4>No services available. Please add a new service.</h4>
                        <NavLink to="/services/add-service">
                            <button className="simple-btn mt-2">Add Service</button>
                        </NavLink>
                    </div>
                )}
            </div>
        </section>
    );
}



export default Services;
