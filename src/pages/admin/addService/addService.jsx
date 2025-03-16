import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import styles from './addService.module.scss';
import { toast } from 'react-toastify';
import useAddService from './useAddService';
import { PulseLoader } from 'react-spinners';
// import { useParams } from 'react-router-dom';
import Loading from '../../../components/loading/loading';

const AddService = () => {
    // Get initial values, validation schema, and submit handler from the custom hook
    // const { serviceId } = useParams(); // Check if we're editing

    const { handleSubmit, initialValues, validationSchema, loading } = useAddService();

    return (

        <>
            {
                loading ? <Loading /> : (
                    <>

                        <section className={`${styles.addService}`}>
                            <div className={`${styles.formWrapper} mt-5`}>
                                {/* <h3>{serviceId ? "Edit Service" : "Add Service"}</h3> */}
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, actions) => {
                                        if (values.intakeForm.length === 0) {
                                            toast.error('At least one field is required before adding a service.');
                                            actions.setSubmitting(false);
                                            return;
                                        }
                                        handleSubmit(values, actions);
                                    }}
                                >
                                    {({ isSubmitting, values }) => (
                                        <Form className={styles.form}>
                                            {/* Service Name */}
                                            <div className={styles.formGroup}>
                                                <label htmlFor="serviceName">Service Name</label>
                                                <Field
                                                    type="text"
                                                    id="serviceName"
                                                    name="serviceName"
                                                    placeholder="Enter service name"
                                                />
                                                <ErrorMessage name="serviceName" component="div" className="error" />
                                            </div>

                                            {/* Default Price */}
                                            <div className={styles.formGroup}>
                                                <label htmlFor="defaultPrice">Default Price</label>
                                                <Field
                                                    type="number"
                                                    id="defaultPrice"
                                                    name="defaultPrice"
                                                    placeholder="Enter default price"
                                                />
                                                <ErrorMessage
                                                    name="defaultPrice"
                                                    component="div"
                                                    className="error"
                                                />
                                            </div>

                                            {/* Dynamic Service Intake Fields */}
                                            <FieldArray name="intakeForm">
                                                {({ push, remove }) => {
                                                    const handleAddField = () => {
                                                        if (values.intakeForm.length > 0) {
                                                            const lastField =
                                                                values.intakeForm[values.intakeForm.length - 1];
                                                            if (!lastField.label || !lastField.fieldType) {
                                                                toast.warning(
                                                                    'Please fill the label and select type'
                                                                );
                                                                return;
                                                            }
                                                        }
                                                        push({ label: '', fieldType: '', options: '', required: false });
                                                    };

                                                    return (
                                                        <div className={styles.fieldArray}>
                                                            <h3 className="mt-3">Service Intake Form Fields</h3>
                                                            {values.intakeForm && values.intakeForm.length > 0 ? (
                                                                values.intakeForm.map((field, index) => (
                                                                    <div key={index} className={styles.dynamicField}>
                                                                        <div className={styles.formGroup}>
                                                                            <label htmlFor={`intakeForm.${index}.label`}>
                                                                                Field Label
                                                                            </label>
                                                                            <Field
                                                                                type="text"
                                                                                name={`intakeForm.${index}.label`}
                                                                                placeholder="Enter field label"
                                                                            />
                                                                            <ErrorMessage
                                                                                name={`intakeForm.${index}.label`}
                                                                                component="div"
                                                                                className="error"
                                                                            />
                                                                        </div>

                                                                        <div className={styles.formGroup}>
                                                                            <label htmlFor={`intakeForm.${index}.fieldType`} className='mb-2'>
                                                                                Field Type
                                                                            </label>
                                                                            <Field
                                                                                as="select"
                                                                                name={`intakeForm.${index}.fieldType`}
                                                                            >
                                                                                <option value="">Select field type</option>
                                                                                <option value="text">Text</option>
                                                                                <option value="number">Number</option>
                                                                                <option value="select">Select</option>
                                                                                <option value="file">File</option>
                                                                            </Field>
                                                                            <ErrorMessage
                                                                                name={`intakeForm.${index}.fieldType`}
                                                                                component="div"
                                                                                className="error"
                                                                            />
                                                                        </div>

                                                                        {/* Show options input only when field type is select */}
                                                                        {values.intakeForm[index].fieldType === 'select' && (
                                                                            <div className={styles.formGroup}>
                                                                                <label htmlFor={`intakeForm.${index}.options`}>
                                                                                    Options (comma separated)
                                                                                </label>
                                                                                <Field
                                                                                    type="text"
                                                                                    name={`intakeForm.${index}.options`}
                                                                                    placeholder="Enter options, e.g. Option1, Option2"
                                                                                />
                                                                                <ErrorMessage
                                                                                    name={`intakeForm.${index}.options`}
                                                                                    component="div"
                                                                                    className="error"
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        <div className={styles.formGroup}>
                                                                            <label>
                                                                                <Field
                                                                                    type="checkbox"
                                                                                    name={`intakeForm.${index}.required`}
                                                                                />
                                                                                <span className='ms-2'>Required Field</span>
                                                                            </label>
                                                                        </div>

                                                                        <div className="text-end">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => remove(index)}
                                                                                className={`${styles.remove_btn} mt-3`}
                                                                            >
                                                                                Remove Field
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="error">No fields added</div>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="rounded-btn mt-4"
                                                                onClick={handleAddField}
                                                            >
                                                                Add Field
                                                            </button>
                                                        </div>
                                                    );
                                                }}
                                            </FieldArray>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="simple-btn w-100 mt-3 mb-5"
                                            >
                                                {isSubmitting ? <PulseLoader color="#ffffff" size={5} /> : 'Add Service'}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </section>

                    </>
                )
            }
        </>


    );
};

export default AddService;
