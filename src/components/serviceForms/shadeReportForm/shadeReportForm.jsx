/* eslint-disable react/prop-types */
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/orderServiceSlice';
import styles from './shadeReportForm.module.scss';
// import { toast } from 'react-toastify';

const ShadeReportForm = ({ project, handlePreviousStep, handleNextStep }) => {
    const dispatch = useDispatch();

    return (
        <>
            <Formik
                initialValues={{
                    siteAddress: project?.siteAddress || ''
                }}
                onSubmit={(values) => {
                    console.log('Form submitted:', values);
                    dispatch(updateFormData({ serviceId: 'shadeReport', data: values }));
                    // toast.success('Shade Report Form is Completed')
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
        </>
    );
};

export default ShadeReportForm;
