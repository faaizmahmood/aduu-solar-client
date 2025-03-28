import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import styles from "./companyAuth.module.scss";
import logo from '../../../../public/images/AduuSolar_Logo.png';
import useCompanyAuth from "./useCompanyAuth";

const CompanyAuth = () => {
    const { formik, loading } = useCompanyAuth();

    return (
        <section className={styles.companyAuth}>
            <div className={styles.authWrapper}>
                <div className="d-flex justify-content-center w-100 text-center">
                    <img src={logo} className={styles.logo} alt="Logo" />
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                        {/* Owner Name */}
                        <div className="col-md-6">
                            <div className={styles.input_group}>
                                <label>Owner Name</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    placeholder="Your Full Name"
                                    value={formik.values.ownerName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.ownerName && formik.errors.ownerName && (
                                    <div className="error">{formik.errors.ownerName}</div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <div className={styles.input_group}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="error">{formik.errors.email}</div>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="col-md-6">
                            <div className={styles.input_group}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="error">{formik.errors.password}</div>
                                )}
                            </div>
                        </div>

                        {/* Company Name */}
                        <div className="col-md-6">
                            <div className={styles.input_group}>
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={formik.values.companyName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.companyName && formik.errors.companyName && (
                                    <div className="error">{formik.errors.companyName}</div>
                                )}
                            </div>
                        </div>

                        {/* Company Address */}
                        <div className="col-md-12">
                            <div className={styles.input_group}>
                                <label>Company Address</label>
                                <input
                                    type="text"
                                    name="companyAddress"
                                    placeholder="Company Address"
                                    value={formik.values.companyAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.companyAddress && formik.errors.companyAddress && (
                                    <div className="error">{formik.errors.companyAddress}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className={styles.form_submit}>
                        <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
                            {loading ? <PulseLoader color="#ffffff" size={5} /> : "Register"}
                        </button>
                    </div>

                    <div className={styles.signin_link}>
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default CompanyAuth;
