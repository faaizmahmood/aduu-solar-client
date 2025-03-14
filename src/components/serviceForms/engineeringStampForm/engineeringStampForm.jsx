/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './engineeringStampForm.module.scss';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/orderServiceSlice';
// import { toast } from 'react-toastify';

const EngineeringStampForm = ({ project, handlePreviousStep, handleNextStep }) => {
    const dispatch = useDispatch();

    // Validation Schema
    const validationSchema = Yup.object({
        stampType: Yup.string().required('Stamp Type is required'),
        planSet: Yup.mixed().required('Plan Set file is required'),
        siteSurvey: Yup.mixed().required('Site Survey file is required'),
    });

    // Initial Form Values
    const initialValues = {
        stampType: '',
        planSet: null,
        siteSurvey: null,
    };

    // Form Submission Handler
    const handleSubmit = (values) => {
        console.log('Form submitted:', values);
        dispatch(updateFormData({ serviceId: 'engineeringStamp', data: values }));
        // toast.success('Engineering Submitted');
        handleNextStep();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue }) => (
                <Form className={styles.engineeringStampForm}>
                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Stamp Type</label>
                        <Field as="select" name="stampType" className="mt-2">
                            <option value="">Select Stamp Type</option>
                            <option value="structural">Structural</option>
                            <option value="electrical">Electrical</option>
                        </Field>
                        <ErrorMessage name="stampType" component="div" className={"error"} />
                    </div>

                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Plan Set (Upload File)</label>
                        <input
                            type="file"
                            name="planSet"
                            className="mt-2"
                            onChange={(event) => setFieldValue("planSet", event.currentTarget.files[0])}
                        />
                        <ErrorMessage name="planSet" component="div" className={"error"} />
                    </div>

                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Site Survey (Upload File)</label>
                        <input
                            type="file"
                            name="siteSurvey"
                            className="mt-2"
                            onChange={(event) => setFieldValue("siteSurvey", event.currentTarget.files[0])}
                        />
                        <ErrorMessage name="siteSurvey" component="div" className={"error"} />
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

export default EngineeringStampForm;
