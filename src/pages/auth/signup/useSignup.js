import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import apiService from '../../../utils/apiClient';

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await apiService.post('/auth/signup', values);
                const { authToken } = response.data; // Assuming API returns { authToken: '...' }

                // Store token in cookies (expires in 7 days)
                Cookies.set('authToken', authToken, { expires: 7 });

                toast.success('Signup Successful!');
                console.log('Signup Successful:', response.data);
                location.reload();
            } catch (error) {
                console.error('Signup Error:', error.response?.data || error.message);
                toast.error(error.response?.data?.message || 'Signup Failed');
            } finally {
                setLoading(false);
            }
        }
    });


    return {
        formik,
        loading,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword
    };
};

export default useSignup;
