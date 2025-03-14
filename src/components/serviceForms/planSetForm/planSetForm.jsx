/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './planSetForm.module.scss';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/orderServiceSlice';
// import { toast } from 'react-toastify';

const PlanSetForm = ({ project, handlePreviousStep, handleNextStep }) => {
    const dispatch = useDispatch();

    // Validation Schema
    const validationSchema = Yup.object({
        projectType: Yup.string().required('Project Type is required'),
        mountingType: Yup.string().required('Mounting Type is required'),
        siteSurvey: Yup.mixed().required('Site Survey file is required'),
        proposal: Yup.mixed().required('Proposal file is required'),
    });

    // Initial Form Values
    const initialValues = {
        projectType: '',
        mountingType: '',
        siteSurvey: null,
        proposal: null,
    };

    // Form Submission Handler
    const handleSubmit = (values) => {
        console.log('Form submitted:', values);
        dispatch(updateFormData({ serviceId: 'planSet', data: values }));
        // toast.success('Plan Set Submitted');
        handleNextStep();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue }) => (
                <Form className={styles.planSetForm}>
                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Project Type</label>
                        <Field as="select" name="projectType" className="mt-2">
                            <option value="">Select Project Type</option>
                            <option value="solar">Solar</option>
                            <option value="battery">Battery</option>
                            <option value="solar_battery">Solar + Battery</option>
                        </Field>
                        <ErrorMessage name="projectType" component="div" className={"error"} />
                    </div>

                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Mounting Type</label>
                        <Field as="select" name="mountingType" className="mt-2">
                            <option value="">Select Mounting Type</option>
                            <option value="ground">Ground</option>
                            <option value="roof">Roof</option>
                        </Field>
                        <ErrorMessage name="mountingType" component="div" className={"error"} />
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

                    <div className={`${styles.formGroup} mt-2`}>
                        <label>Proposal (Upload File)</label>
                        <input
                            type="file"
                            name="proposal"
                            className="mt-2"
                            onChange={(event) => setFieldValue("proposal", event.currentTarget.files[0])}
                        />
                        <ErrorMessage name="proposal" component="div" className={"error"} />
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

export default PlanSetForm;
