import styles from './dashboard.module.scss'
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    CartesianGrid,
    Line,
    LineChart,
} from 'recharts';
import useDashboard from './useDashboard';
import renderActiveShape from './renderActiveShape';
import { NavLink } from 'react-router-dom';
import Loading from '../../../components/loading/loading'


const AdminDashboard = () => {

    const {
        topServicesData,
        COLORS,
        monthlyServiceData,
        activeIndex,
        onPieEnter,
        stats,
        loading
    } = useDashboard();

    return (
        <>
            {
                loading ? <Loading /> : (
                    <>
                        <section className={styles.dashboard}>

                            {/* --- Stat Cards --- */}
                            <div className='row mb-4'>
                                {[
                                    { icon: 'fa-handshake', title: 'Total Clients' },
                                    { icon: 'fa-buildings', title: 'Total Companies' },
                                    { icon: 'fa-folders', title: 'Total Projects' },
                                    { icon: 'fa-box', title: 'Total Orders' },
                                ].map((card, i) => (
                                    <div key={i} className='col-md-3 col-sm-4 p-2'>
                                        <div className={styles.cardItem}>
                                            <i className={`fa-regular ${card.icon}`}></i>
                                            <h3>{card.title}</h3>
                                            {
                                                [stats.totalClients, stats.totalCompanies, stats.totalProjects, stats.totalOrders][i] ?? '--'
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- Quick Actions --- */}
                            <div className={`row mb-4 ${styles.quickActions}`}>
                                <div className='col-12'>
                                    <h4 className={styles.sectionTitle}>Quick Actions</h4>
                                    <div className='d-flex flex-wrap gap-3'>
                                        <NavLink to='services/add-service'> <button className={`${styles.btn}`}><i className="fa-regular fa-plus me-1"></i> Create Service</button></NavLink>
                                        <NavLink to='manage-team'><button className={`${styles.btn}`}><i className="fa-regular fa-plus me-1"></i> Add Staff</button></NavLink>
                                        <NavLink to='projects'> <button className={`${styles.btn}`}>Assign Staff to Project</button></NavLink>
                                        <NavLink to='settings'><button className={`${styles.btn}`}>Go to Settings</button></NavLink>
                                    </div>
                                </div>
                            </div>

                            {/* --- Charts Section --- */}
                            <div className='row mb-4 mt-5'>
                                <div className='col-md-6 p-2'>
                                    <div className={styles.chartCard}>
                                        <h4>Services Requested (Monthly)</h4>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={monthlyServiceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="orders" stroke="#1A1E34" strokeWidth={3} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>



                                <div className='col-md-6 p-2'>
                                    <div className={styles.chartCard}>
                                        <h4>Top Ordered Services</h4>
                                        <ResponsiveContainer width='100%' height={250}>
                                            <PieChart>
                                                <Pie
                                                    activeIndex={activeIndex}
                                                    activeShape={renderActiveShape}
                                                    data={topServicesData}
                                                    dataKey="count"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                    onMouseEnter={onPieEnter}
                                                >
                                                    {topServicesData.map((_, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                {/* <Legend /> */}
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* --- Recent Activity --- */}
                            {/* <div className='row mb-4'>
    <div className='col-12 p-2'>
        <div className={styles.activityCard}>
            <h4>Recent Activity</h4>
            <ul className={styles.activityList}>
                <li>Project <strong>“Smith Solar Install”</strong> created by <em>John Doe</em></li>
                <li>Service <strong>Plan Set</strong> ordered for <em>Green Valley Project</em></li>
                <li><em>Jane Smith</em> was assigned to <strong>Company: SunTech</strong></li>
                <li>Invoice #1023 marked as <strong>Paid</strong></li>
            </ul>
        </div>
    </div>
</div> */}

                        </section>
                    </>
                )
            }
        </>
    )
}

export default AdminDashboard
