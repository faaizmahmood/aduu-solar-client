import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAddService = () => {
    const initialValues = {
        serviceName: "",
        defaultPrice: "",
        serviceFields: [],
    };

    const validationSchema = Yup.object({
        serviceName: Yup.string().required("Service name is required"),
        defaultPrice: Yup.number()
            .typeError("Default price must be a number")
            .required("Default price is required"),
        serviceFields: Yup.array()
            .of(
                Yup.object().shape({
                    label: Yup.string().required("Field label is required"),
                    fieldType: Yup.string().required("Field type is required"),
                    options: Yup.string()
                        .nullable()
                        .when("fieldType", (fieldType, schema) =>
                            fieldType === "select"
                                ? schema.required("Options are required for select field")
                                : schema
                        ),
                    required: Yup.boolean().default(false),
                })
            )
            .nullable()
            .default([]),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {

        const token = Cookies.get("authToken");

        if (values.serviceFields.length === 0) {
            toast.error("At least one field is required before adding a service.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/service/add-service`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                toast.success("Service added successfully!");
                resetForm();
                return;
            }

            toast.error(response.data.message || "Failed to add service");
        } catch (error) {
            console.error("Error adding service:", error);
            toast.error(
                error.response?.data?.message || "An unexpected error occurred. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return {
        handleSubmit,
        initialValues,
        validationSchema,
    };
};

export default useAddService;
