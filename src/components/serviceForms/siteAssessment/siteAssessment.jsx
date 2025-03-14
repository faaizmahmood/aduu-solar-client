

/* eslint-disable react/prop-types */
import { Formik, Form, Field } from 'formik';
import styles from './siteAssessmentForm.module.scss';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/orderServiceSlice';
// import { toast } from 'react-toastify';

const SiteAssessment = ({ project, handlePreviousStep, handleNextStep }) => {
    const dispatch = useDispatch();
    return (
        <Formik
            initialValues={{
                siteAddress: project?.siteAddress || ''
            }}
            onSubmit={(values) => {
                console.log('Form submitted:', values);
                dispatch(updateFormData({ serviceId: 'siteAssesment', data: values }));
                // toast.success('Site Assesment Form is Completed')
                handleNextStep();
            }}
        >
            {() => (
                <Form className={styles.shadeReportForm}>
                    <div className={styles.step1}>
                        <label>Address of Project</label>
                        <Field name="siteAddress" className="mt-2" disabled />
                    </div>

                    <div className={styles.orderServiceNavigation}>
                        <button type="button" className={styles.navigationbtn} onClick={handlePreviousStep} >
                            <i className="fa-regular fa-arrow-left"></i>
                        </button>
                        <button type='submit' className={styles.navigationbtn}  >
                            <i className="fa-regular fa-arrow-right"></i>
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SiteAssessment;
