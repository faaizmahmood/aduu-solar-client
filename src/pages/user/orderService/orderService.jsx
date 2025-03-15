// import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import styles from './orderService.module.scss';

// Import Service Forms
import ShadeReportForm from '../../../components/serviceForms/shadeReportForm/shadeReportForm';
import PlanSetForm from '../../../components/serviceForms/planSetForm/planSetForm';
import EngineeringStampForm from '../../../components/serviceForms/engineeringStampForm/engineeringStampForm';
import EngineeringLettersForm from '../../../components/serviceForms/engineeringLettersForm/engineeringLettersForm';
import SiteAssessment from '../../../components/serviceForms/siteAssessment/siteAssessment';
import useOrderService from './useOrderService';
import Loading from '../../../components/loading/loading';

const OrderService = () => {
    const {
        toggleServiceSelection,
        handleNextStep,
        handlePreviousStep,
        selectedServices,
        step,
        totalSteps,
        project,
        loading
    } = useOrderService();

    const serviceForms = {
        shade_report: <ShadeReportForm project={project} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />,
        site_assessment: <SiteAssessment project={project} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />,
        plan_set: <PlanSetForm project={project} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />,
        engineering_stamp: <EngineeringStampForm project={project} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />,
        engineering_letters: <EngineeringLettersForm project={project} handleNextStep={handleNextStep} handlePreviousStep={handlePreviousStep} />
    };

    const services = [
        { id: 'shade_report', name: 'Shade Report' },
        { id: 'site_assessment', name: 'Site Assessment' },
        { id: 'plan_set', name: 'Plan Set' },
        { id: 'engineering_stamp', name: 'Engineering Stamp' },
        { id: 'engineering_letters', name: 'Engineering Letters' },
    ];

    const currentServiceName = step >= 3 && step - 3 < selectedServices.length
        ? services.find(service => service.id === selectedServices[step - 3])?.name
        : '';

    return (
        <>
            {/* <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet> */}

            {/* <h3>Order Service</h3> */}
            {currentServiceName && <h5>{currentServiceName}</h5>}

            <section className={styles.orderService}>
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={styles.stepContainer}
                >
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            {step === 1 && (
                                <div className={styles.step1}>
                                    <label>Select Project</label>
                                    <input value={`${project?.projectName} (${project?._id})`} className='mt-2' disabled />
                                </div>
                            )}

                            {step === 2 && (
                                <div className={styles.step2}>
                                    <label>Select Services</label>
                                    <div className='mt-2'>
                                        {services.map(service => (
                                            <div key={service.id}>
                                                <input
                                                    type='checkbox'
                                                    value={service.id}
                                                    checked={selectedServices.includes(service.id)}
                                                    onChange={() => toggleServiceSelection(service.id)}
                                                /> {service.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step >= 3 && step - 3 < selectedServices.length && (
                                <div className={styles.serviceForm}>
                                    {serviceForms[selectedServices[step - 3]]}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>

                <div className={styles.orderServiceNavigation}>
                    <button className={styles.navigationbtn} onClick={handlePreviousStep} disabled={step === 1 || loading}>
                        <i className="fa-regular fa-arrow-left"></i>
                    </button>
                    <button className={styles.navigationbtn} onClick={handleNextStep} disabled={step === totalSteps || loading}>
                        <i className="fa-regular fa-arrow-right"></i>
                    </button>
                </div>
            </section>
        </>
    );
}

export default OrderService;
