import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import apiService from "../../../utils/apiClient";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const useOrderService = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isIntakeFormActive, setIsIntakeFormActive] = useState(false);
    const [isInvoiceStepActive, setIsInvoiceStepActive] = useState(false);
    const currentUser = useSelector((state) => state.user.user)
    const { projectID } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                NProgress.start();
                const response = await apiService.get("/service/get-service");
                if (response.status === 200) {
                    setServices(response.data.services);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
                toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
            } finally {
                NProgress.done();
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const toggleServiceSelection = (service) => {
        setSelectedServices((prev) =>
            prev.some((s) => s._id === service._id)
                ? prev.filter((s) => s._id !== service._id)
                : [...prev, service]
        );
    };

    const handleNextForm = () => {
        if (!validateForm(selectedServices[currentFormIndex]._id)) return;

        if (currentFormIndex < selectedServices.length - 1) {
            setCurrentFormIndex((prev) => prev + 1);
        } else {
            setIsInvoiceStepActive(true);  // Activate invoice step
            console.log("Invoice step activated");
        }
    };


    const handlePrevForm = () => {
        if (isInvoiceStepActive) {
            setIsInvoiceStepActive(false);
        } else if (currentFormIndex > 0) {
            setCurrentFormIndex((prev) => prev - 1);
        }
    };

    const handleFormChange = (serviceId, fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                [fieldName]: value,
            },
        }));
        setErrors((prev) => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                [fieldName]: "",
            },
        }));
    };

    const validateForm = (serviceId) => {
        const service = selectedServices.find((s) => s._id === serviceId);
        if (!service) return true;

        const newErrors = {};
        service.intakeForm.forEach((field) => {
            if (!formData[serviceId]?.[field.label]) {
                newErrors[field.label] = "This field is required";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors((prev) => ({
                ...prev,
                [serviceId]: newErrors,
            }));
            return false;
        }
        return true;
    };

    const handleSubmitOrder = async () => {
        if (!validateForm(selectedServices[currentFormIndex]._id)) return;

        const orderPayload = {
            clientId: currentUser._id,
            projectId: projectID,
            companyId: 'N/A',
            services: selectedServices.map((service) => ({
                serviceId: service._id,
                serviceName: service.serviceName,
                formResponses: Object.entries(formData[service._id] || {}).map(([fieldName, fieldValue]) => ({
                    fieldName,
                    fieldValue
                }))
            }))
        };

        console.log("Submitting order for:", orderPayload);

        try {
            NProgress.start();
            const response = await apiService.post("/service/order-service", orderPayload);
            if (response.status === 201) {
                toast.success("Order submitted successfully!");
                generateInvoice(response.data.order._id);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error(error.response?.data?.message || "Failed to submit order.");
        } finally {
            NProgress.done();
        }
    };


    const generateInvoice = async (orderId) => {
        const invoicePayload = {
            orderId,
            clientId: currentUser._id,
            projectId: projectID,
            companyId: currentUser.companyId,
            totalAmount: selectedServices.reduce((sum, service) => sum + service.defaultPrice, 0),
            services: selectedServices.map((service) => ({
                serviceId: service._id,
                serviceName: service.serviceName,
                price: service.defaultPrice,
            })),
            status: "Pending Payment",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            paidAt: null
        };

        try {
            const response = await apiService.post("/invoice/create-invoice", invoicePayload);
            if (response.status === 201) {
                toast.success("Invoice generated successfully!");
                navigate("/invoices");
            }
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error(error.response?.data?.message || "Failed to generate invoice.");
        }
    };



    return {
        loading,
        services,
        selectedServices,
        toggleServiceSelection,
        handleSubmitOrder,
        currentFormIndex,
        handleNextForm,
        handlePrevForm,
        formData,
        handleFormChange,
        errors,
        isIntakeFormActive,
        setIsIntakeFormActive,
        isInvoiceStepActive,
        setIsInvoiceStepActive
    };
};

export default useOrderService;
