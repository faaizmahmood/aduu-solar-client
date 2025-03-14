/* eslint-disable react/prop-types */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './engineeringLettersForm.module.scss';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/orderServiceSlice';
// import { toast } from 'react-toastify';

const EngineeringLettersForm = ({ handlePreviousStep, handleNextStep }) => {
    const dispatch = useDispatch();

    // Validation Schema
    const validationSchema = Yup.object({
        letterType: Yup.string().required('Letter Type is required'),
    });

    // Initial Form Values
    const initialValues = {
        letterType: '',
    };

    // Form Submission Handler
    const handleSubmit = (values) => {
        console.log('Form submitted:', values);
        dispatch(updateFormData({ serviceId: 'engineeringLetters', data: values }));
        // toast.success('Engineering Letters Submitted');
        handleNextStep();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form className={styles.engineeringLettersForm}>
                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Letter Type</label>
                        <Field as="select" name="letterType" className="mt-2">
                            <option value="">Select Letter Type</option>
                            <option value="structural_evaluation">Structural Evaluation</option>
                            <option value="structural_ground_mount">Structural Ground Mount</option>
                            <option value="post_install">Post-Install</option>
                        </Field>
                        <ErrorMessage name="letterType" component="div" className={"error"} />
                    </div>

                    <div className={styles.orderServiceNavigation}>
                        <button type="button" className={styles.navigationbtn} onClick={handlePreviousStep} >
                            <i className="fa-regular fa-arrow-left"></i>
                        </button>
                        <button type='submit' className={styles.navigationbtn} >
                            <i className="fa-regular fa-arrow-right"></i>
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default EngineeringLettersForm;