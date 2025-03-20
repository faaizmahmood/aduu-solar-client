import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiService from "../../../utils/apiClient";


const useAddService = () => {

    const { serviceId } = useParams();

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({
        serviceName: "",
        defaultPrice: "",
        intakeForm: [],
    });

    const validationSchema = Yup.object({
        serviceName: Yup.string().required("Service name is required"),
        defaultPrice: Yup.number()
            .typeError("Default price must be a number")
            .required("Default price is required"),
        intakeForm: Yup.array()
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


    // Fetch service data if editing
    useEffect(() => {
        if (!serviceId) return;

        const fetchService = async () => {
            setLoading(true);
            try {
                const response = await apiService.get(`/service/get-service/${serviceId}`);

                if (response.status === 200) {
                    const service = response.data.services;

                    setInitialValues({
                        serviceName: service.serviceName || "",
                        defaultPrice: service.defaultPrice || "",
                        intakeForm: service.intakeForm || [],
                    });

                    return;
                }

                toast.error(response.data.message || "Failed to load!");
            } catch (error) {
                console.error("Fetch Service Error:", error);
                toast.error("Failed to load service data...");

                if (error.response?.status === 404) {
                    navigate("/services");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId, navigate]);




    // Handle submit (add/edit service)
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            let response;
            if (serviceId) {
                // Update Service
                response = await apiService.put(`/service/update-service/${serviceId}`, values);
            } else {
                // Add Service
                response = await apiService.post(`/service/add-service`, values);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(`Service ${serviceId ? "updated" : "added"} successfully!`);
                resetForm();
                navigate("/services");
            } else {
                toast.error(response.data.message || "Failed to save service");
            }
        } catch (error) {
            console.error("Service Error:", error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };


    return {
        handleSubmit,
        initialValues,
        validationSchema,
        loading
    };
};

export default useAddService;
