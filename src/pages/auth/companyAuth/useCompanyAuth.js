import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import apiService from "../../../utils/apiClient";
import Cookies from 'js-cookie';

const useCompanyAuth = () => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            ownerName: "",
            email: "",
            password: "",
            companyName: "",
            companyAddress: "",
        },
        validationSchema: Yup.object({
            ownerName: Yup.string().min(3, "Name must be at least 3 characters").required("Owner Name is required"),
            email: Yup.string().email("Invalid email format").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            companyName: Yup.string().min(3, "Company Name must be at least 3 characters").required("Company Name is required"),
            companyAddress: Yup.string().required("Company Address is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Step 1: Register User (Owner)
                const userPayload = {
                    name: values.ownerName,
                    email: values.email,
                    password: values.password,
                    companyRole: "owner",
                };

                let userResponse;
                try {
                    userResponse = await apiService.post("/auth/signup", userPayload);
                } catch (error) {
                    if (error.response?.status === 400 && error.response?.data?.message === "User already exists.") {
                        toast.error("User already exists.");
                        setLoading(false);
                        return; // Stop execution
                    }
                    throw error; // Re-throw other errors
                }

                const { userId } = userResponse.data;


                // Step 2: Register Company
                const companyPayload = {
                    companyName: values.companyName,
                    companyAddress: values.companyAddress,
                    ownerId: userId,
                };
                await apiService.post("/auth/companies-register", companyPayload);

                toast.success("Company Registered Successfully!");
                console.log("Registration Success:", { userResponse });

                const { authToken } = userResponse.data; // Assuming API returns { authToken: '...' }

                // Store token in cookies (expires in 7 days)
                Cookies.set('authToken', authToken, { expires: 7 });

                // Redirect user after successful signup
                location.reload();
            } catch (error) {
                console.error("Registration Error:", error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Registration Failed");
            } finally {
                setLoading(false);
            }
        }
    });

    return { formik, loading };
};

export default useCompanyAuth;
