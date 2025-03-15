import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import styles from './addService.module.scss';
import { toast } from 'react-toastify';
import useAddService from './useAddService';
import { PulseLoader } from 'react-spinners';

const AddService = () => {
    // Get initial values, validation schema, and submit handler from the custom hook
    const { handleSubmit, initialValues, validationSchema } = useAddService();

    return (
        <section className={`${styles.addService}`}>
            <div className={`${styles.formWrapper} mt-5`}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        if (values.serviceFields.length === 0) {
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
                            <FieldArray name="serviceFields">
                                {({ push, remove }) => {
                                    const handleAddField = () => {
                                        if (values.serviceFields.length > 0) {
                                            const lastField =
                                                values.serviceFields[values.serviceFields.length - 1];
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
                                            {values.serviceFields && values.serviceFields.length > 0 ? (
                                                values.serviceFields.map((field, index) => (
                                                    <div key={index} className={styles.dynamicField}>
                                                        <div className={styles.formGroup}>
                                                            <label htmlFor={`serviceFields.${index}.label`}>
                                                                Field Label
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                name={`serviceFields.${index}.label`}
                                                                placeholder="Enter field label"
                                                            />
                                                            <ErrorMessage
                                                                name={`serviceFields.${index}.label`}
                                                                component="div"
                                                                className="error"
                                                            />
                                                        </div>

                                                        <div className={styles.formGroup}>
                                                            <label htmlFor={`serviceFields.${index}.fieldType`} className='mb-2'>
                                                                Field Type
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                name={`serviceFields.${index}.fieldType`}
                                                            >
                                                                <option value="">Select field type</option>
                                                                <option value="text">Text</option>
                                                                <option value="number">Number</option>
                                                                <option value="select">Select</option>
                                                                <option value="file">File</option>
                                                            </Field>
                                                            <ErrorMessage
                                                                name={`serviceFields.${index}.fieldType`}
                                                                component="div"
                                                                className="error"
                                                            />
                                                        </div>

                                                        {/* Show options input only when field type is select */}
                                                        {values.serviceFields[index].fieldType === 'select' && (
                                                            <div className={styles.formGroup}>
                                                                <label htmlFor={`serviceFields.${index}.options`}>
                                                                    Options (comma separated)
                                                                </label>
                                                                <Field
                                                                    type="text"
                                                                    name={`serviceFields.${index}.options`}
                                                                    placeholder="Enter options, e.g. Option1, Option2"
                                                                />
                                                                <ErrorMessage
                                                                    name={`serviceFields.${index}.options`}
                                                                    component="div"
                                                                    className="error"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className={styles.formGroup}>
                                                            <label>
                                                                <Field
                                                                    type="checkbox"
                                                                    name={`serviceFields.${index}.required`}
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
    );
};

export default AddService;
