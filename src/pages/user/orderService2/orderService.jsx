import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../../components/loading/loading";
import styles from "./orderService.module.scss";
import useOrderService from "./useOrderService";
import DynamicIntakeForm from "../../../components/DynamicIntakeForm/DynamicIntakeForm";

const OrderService = () => {
    const {
        loading,
        services,
        selectedServices,
        toggleServiceSelection,
        handleSubmitOrder,
        currentFormIndex,
        handleNextForm,
        handlePrevForm,
        formData,
        handleFormChange,
        errors,
        isIntakeFormActive,
        setIsIntakeFormActive,
        isInvoiceStepActive,
        setIsInvoiceStepActive,
    } = useOrderService();

    if (loading) return <Loading />;

    return (
        <section className={`${styles.orderService} mt-4`}>
            {!isIntakeFormActive ? (
                <>
                    <h5>Select Services for Your Project</h5>
                    <div className="row mt-2">
                        <AnimatePresence>
                            {services.length > 0 ? (
                                services.map((service, index) => (
                                    <motion.div
                                        key={service._id || index}
                                        className="col-4 p-2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    >
                                        <div
                                            className={styles.serviceItem}
                                            style={{
                                                border: selectedServices.some(s => s._id === service._id)
                                                    ? "1px solid #1A1E34"
                                                    : "",
                                            }}
                                            onClick={() => toggleServiceSelection(service)}
                                        >
                                            <h3>
                                                {index + 1}. {service.serviceName} <span>(${service.defaultPrice})</span>
                                            </h3>
                                            {service.intakeForm?.length > 0 && (
                                                <h5 className="mt-2">
                                                    {service.intakeForm.map(field => field.label).join(", ")}
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {selectedServices.length > 0 && (
                        <div className="text-center">
                            <button className="simple-btn mt-3" onClick={() => setIsIntakeFormActive(true)}>
                                Proceed Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {!isInvoiceStepActive ? (
                        <div className="mt-4">
                            {/* Progress Bar */}
                            <div className="progress mb-3" style={{ height: "10px" }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${((currentFormIndex + 1) / selectedServices.length) * 100}%`, backgroundColor: "var(--primary-color)" }}
                                    aria-valuenow={currentFormIndex + 1}
                                    aria-valuemin="0"
                                    aria-valuemax={selectedServices.length}
                                ></div>
                            </div>

                            {/* Step Indicator */}
                            <p className="text-center">
                                Step {currentFormIndex + 1} of {selectedServices.length}
                            </p>

                            {/* Dynamic Intake Form */}
                            <DynamicIntakeForm
                                service={selectedServices[currentFormIndex]}
                                formData={formData[selectedServices[currentFormIndex]._id] || {}}
                                handleFormChange={handleFormChange}
                                errors={errors[selectedServices[currentFormIndex]._id] || {}}
                            />

                            {/* Navigation Buttons */}
                            <div className="d-flex justify-content-between mt-4">
                                <button className="simple-btn" onClick={() => setIsIntakeFormActive(false)}>
                                    Back to Service Selection
                                </button>
                                {currentFormIndex > 0 && (
                                    <button className="simple-btn" onClick={handlePrevForm}>
                                        Previous
                                    </button>
                                )}
                                {currentFormIndex < selectedServices.length - 1 ? (
                                    <button className="simple-btn" onClick={handleNextForm}>
                                        Next
                                    </button>
                                ) : (
                                    <button className="simple-btn" onClick={() => setIsInvoiceStepActive(true)}>
                                        Review Invoice
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-start">
                            <h5>Invoice Review</h5>
                            <ul className={`${styles.list_group} list-group  mb-3`}>
                                {selectedServices.map((service, index) => (
                                    <li key={service._id} className={`p-3 my-2 ${styles.list_group_item} list-group-item`}>
                                        {index + 1}. {service.serviceName} - <strong>${service.defaultPrice}</strong>
                                    </li>
                                ))}
                            </ul>
                            <button className="simple-btn" onClick={handleSubmitOrder}>
                                Confirm & Submit Order
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default OrderService;