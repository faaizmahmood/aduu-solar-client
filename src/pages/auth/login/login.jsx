import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './login.module.scss';
import logo from '../../../../public/images/AduuSolar_Logo.png';
import useLogin from './useLogin';
import { PulseLoader } from 'react-spinners';
// import { Helmet } from "react-helmet-async";

const Login = () => {
    const { formik, loading } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {/* <Helmet>
                <title>Login | AduuSolar</title>
                <meta name="description" content="Log in to your AduuSolar account to manage your solar projects efficiently." />
                <meta name="keywords" content="AduuSolar, Solar Projects, Login, Dashboard" />
                <meta property="og:title" content="Login | AduuSolar" />
                <meta property="og:description" content="Log in to your AduuSolar account to manage your solar projects efficiently." />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet> */}

            <section className={`${styles.login}`}>
                <div className={`${styles.loginWrapper}`}>
                    <div className='d-flex justify-content-center w-100 text-center'>
                        <img src={logo} className={`${styles.logo}`} alt='Logo' />
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className={`${styles.input_group}`}>
                            <label>Email</label>
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className={'error'}>{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className={`${styles.input_group} ${styles.password}`}>
                            <label>Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    placeholder='Password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <span onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className={'error'}>{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <div className={`${styles.form_submit}`}>
                            <button type='submit' className='filled' disabled={!formik.isValid || formik.isSubmitting}>
                                {loading ? <PulseLoader color="#ffffff" size={5} /> : "Sign In"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Login;
