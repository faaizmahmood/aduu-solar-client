import styles from './company.module.scss';
import { DataGrid } from "@mui/x-data-grid";
import useCompany from './useCompany';
import Loading from '../../../components/loading/loading';
import Model from '../../../components/model/model';
import { PulseLoader } from 'react-spinners';


const Company = () => {
    const {
        loading,
        companyData,
        formatDate,
        columns,
        setSearchQuery,
        filteredRows,
        searchQuery,
        model,
        handleModelClose,
        handleModelOpen,
        formik,
        formsubmissionLoading
    } = useCompany();



    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <section className={`${styles.company}`}>
                    <div className={`${styles.banner} mt-3`}>
                        <h1>{companyData?.companyName}</h1>
                        <h2>Owner: {companyData?.owner?.name || "N/A"}</h2>
                        <h5>Founded: {companyData?.createdAt ? formatDate(companyData.createdAt) : "N/A"}</h5>
                        <h5>Address: {companyData?.address || "Not Provided"}</h5>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-6'></div>
                        <div className='col-6'>
                            <div className='row'>
                                <div className='col-8'>
                                    <input
                                        type="text"
                                        placeholder="Search Members"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`${styles.searchInput}`}
                                    />
                                </div>
                                <div className='col-4'>
                                    <button className="simple-btn w-100" onClick={handleModelOpen}>
                                        <i className="fa-regular fa-plus me-1"></i> Add Mebmer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.members} mt-3`}>
                        <DataGrid
                            style={{ borderRadius: '10px' }}
                            rows={filteredRows}
                            columns={columns}
                            pageSize={5}
                            autoHeight
                        />
                    </div>
                </section>
            )}

            {/* Modal for Adding Staff */}
            <Model showModal={model} handleClose={handleModelClose}>
                <h3>Add New Member</h3>
                <form onSubmit={formik.handleSubmit} className={`${styles.addMebmerModel} text-start`}>
                    <div className='mt-3'>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && <div className="error">{formik.errors.name}</div>}
                    </div>

                    <div className='mt-3'>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}
                    </div>

                    <div className='mt-3'>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}
                    </div>


                    <div className='mt-3'>
                        <label>Company Role (Optional)</label>
                        <input
                            type="text"
                            name="companyRole"
                            placeholder="Company Role"
                            value={formik.values.companyRole}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                    </div>

                    <div className="form-submit mt-3">
                        <button type="submit" className='simple-btn w-100' disabled={!formik.isValid || formik.isSubmitting}>
                            {formsubmissionLoading ? <PulseLoader color="#ffffff" size={5} /> : "Add Staff"}
                        </button>
                    </div>
                </form>
            </Model>
        </>
    );
};

export default Company;
