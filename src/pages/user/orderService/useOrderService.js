import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NProgress from "nprogress";
import { setProject } from "../../../redux/orderServiceSlice";
import Cookies from "js-cookie";
import axios from "axios";

const useOrderService = () => {

    const location = useLocation();

    const dispatch = useDispatch();

    const navagate = useNavigate()

    const authToken = Cookies.get("authToken");

    const orderServiceState = useSelector(state => state.OrderServiceData);
    
    const projectId = orderServiceState?.projectId || null;

    const project = location.state?.project || {};

    if (!project) {
        navagate('/projects')
    }

    if (project?._id && projectId !== project._id) {
        dispatch(setProject(project._id));
    }

    const [selectedServices, setSelectedServices] = useState([]);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    // const [files, setFiles] = useState({});

    const totalSteps = 2 + selectedServices.length;

    const handleNextStep = async () => {
        if (step === 1 && !project?._id) {
            toast.warn("Please select a project before proceeding.");
            return;
        }
        if (step === 2 && selectedServices.length === 0) {
            toast.warn("Please select at least one service");
            return;
        }

        if (step < totalSteps) {
            setLoading(true);
            setTimeout(() => {
                setStep(prevStep => prevStep + 1);
                setLoading(false);
            }, 1000);
        } else if (step === totalSteps) {
            await submitOrder();
        }
    };

    const handlePreviousStep = () => {
        if (step > 1) {
            setLoading(true);
            setTimeout(() => {
                setStep(prevStep => prevStep - 1);
                setLoading(false);
            }, 1000);
        }
    };

    const toggleServiceSelection = (serviceId) => {
        setSelectedServices(prevServices =>
            prevServices.includes(serviceId)
                ? prevServices.filter(id => id !== serviceId)
                : [...prevServices, serviceId]
        );
    };

    // const handleFileUpload = (e, fileType) => {
    //     setFiles(prevFiles => ({
    //         ...prevFiles,
    //         [fileType]: e.target.files[0],
    //     }));
    // };

    const submitOrder = async () => {
        try {
            NProgress.start();
            setLoading(true);

            const payload = {
                projectId,
                selectedServices,
                formData: orderServiceState?.formData || {},
            };

            const response = await axios.post("http://localhost:5000/api/order/order-service", payload, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status >= 200 && response.status < 300) {
                toast.success("Order submitted successfully!");
            } else {
                toast.error("Order submission failed.");
            }

        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error(error.response?.data?.message || "An error occurred while submitting the order.");
        } finally {
            NProgress.done();
            setLoading(false);
        }
    };

    return {
        selectedServices,
        toggleServiceSelection,
        handleNextStep,
        handlePreviousStep,
        // handleFileUpload,
        step,
        totalSteps,
        project,
        loading,
    };
};

export default useOrderService;
