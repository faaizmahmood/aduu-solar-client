// import { Helmet } from 'react-helmet-async';
// import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Loading from '../../../components/loading/loading';
import styles from './orderService.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import useOrderService from './useOrderService';

const OrderService = () => {

    const {
        loading,
        services
    } = useOrderService()


    return (

        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={styles.orderService}>

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
                                                <div></div>
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


                </section>
            )}
        </>

    );
}

export default OrderService;
