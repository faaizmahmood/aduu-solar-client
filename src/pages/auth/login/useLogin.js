import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Cookies from 'js-cookie';

const useLogin = () => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post('https://aduu-solar-00a9b4616138.herokuapp.com/api/auth/signin', values);
                const { authToken } = response.data; // Assuming API returns { token: '...' }

                // Store token in cookies (expires in 7 days)
                Cookies.set('authToken', authToken, { expires: 7 });

                toast.success('Login Successful');
                setLoading(false);
                location.reload()
            } catch (error) {
                setLoading(false);
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('An error occurred. Please try again later.');
                }
            }
        }
    });

    return {
        formik,
        loading
    };
};

export default useLogin;
