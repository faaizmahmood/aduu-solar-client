import { PulseLoader } from 'react-spinners';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './signup.module.scss';
import logo from '../../../../public/images/AduuSolar_Logo.png';
import useSignup from './useSignup';
import { Link } from 'react-router-dom';
// import { Helmet } from "react-helmet-async";

const Signup = () => {
    const {
        formik,
        loading,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword
    } = useSignup();

    return (
        <>
            {/* ✅ Add SEO Metadata */}
            {/* <Helmet>
                <title>Sign Up | AduuSolar</title>
                <meta name="description" content="Create your AduuSolar account and manage your solar projects easily." />
                <meta name="keywords" content="AduuSolar, Sign Up, Solar Energy, Dashboard" />
                <meta property="og:title" content="Sign Up | AduuSolar" />
                <meta property="og:description" content="Create your AduuSolar account and manage your solar projects easily." />
                <meta property="og:type" content="website" />
                <meta name="robots" content="index, follow" />
            </Helmet> */}

            <section className={`${styles.signup}`}>
                <div className={`${styles.loginWrapper}`}>
                    <div className='d-flex justify-content-center w-100 text-center'>
                        <img src={logo} className={`${styles.logo}`} alt="Logo" />
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className={`${styles.input_group}`}>
                            <label>Name</label>
                            <input
                                type='text'
                                name='name'
                                placeholder='Name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className={'error'}>{formik.errors.name}</div>
                            ) : null}
                        </div>

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

                        {/* Password Field */}
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

                        {/* Confirm Password Field */}
                        <div className={`${styles.input_group} ${styles.password}`}>
                            <label>Confirm Password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    placeholder='Confirm Password'
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className={'error'}>{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>

                        <div className={`${styles.form_submit}`}>
                            <button type='submit' disabled={!formik.isValid || formik.isSubmitting}>
                                {loading ? <PulseLoader color="#ffffff" size={5} /> : "Sign Up"}
                            </button>
                        </div>

                        <div className={styles.signin_link}>
                            <p>Already have an account? <Link to='/signup'>Sign In</Link></p>
                        </div>

                        <div className={styles.company_link}>
                            <p>Want to Register Company? <Link to='/company-register'>Register</Link></p>
                        </div>

                    </form>
                </div>
            </section>
        </>
    );
}

export default Signup;
