import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAddService = () => {

    const token = Cookies.get("authToken");

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
                const response = await axios.get(`${API_BASE_URL}/service/get-service/${serviceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200) {

                    const service = response.data.services;

                    setInitialValues({
                        serviceName: service.serviceName || "",
                        defaultPrice: service.defaultPrice || "",
                        intakeForm: service.intakeForm || [],
                    });

                    return
                }

                toast.error(response.data.message || "Failed to load!")
                return

            } catch (error) {
                console.error("Fetch Service Error:", error);
                toast.error("Failed to load service data....");
                // Only navigate if it's a serious issue (like 404)
                if (error.response && error.response.status === 404) {
                    navigate("/services");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId, navigate, token]);



    // Handle submit (add/edit service)
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {

        try {
            let response;
            if (serviceId) {
                // Update Service
                response = await axios.put(`${API_BASE_URL}/service/update-service/${serviceId}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            } else {
                // Add Service
                response = await axios.post(`${API_BASE_URL}/service/add-service`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(`Service ${serviceId ? "updated" : "added"} successfully!`);
                resetForm();
                navigate("/services");
            } else {
                toast.error(response.data.message || "Failed to save service");
            }
        } catch (error) {
            console.log(error)
            toast.error("An error occurred. Please try again.");
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
