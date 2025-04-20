/* eslint-disable no-unused-vars */
import styles from './dashboard.module.scss';
import { DataGrid } from '@mui/x-data-grid';
import useDashboard from './useDashboard';
import Loading from '../../../components/loading/loading';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook


const UserDashboard = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    // Handle the click event to navigate to the project details page
    const handleViewClick = (projectId) => {
        navigate(`/projects`); // Navigate to the project detail page
    };

    const {
        stats,
        loading,
        projects,
        userRecentActivities,
        convertDate
    } = useDashboard();

    if (loading || !stats) {
        return <Loading />;
    }

    // Ensure recentActivity is an array to avoid errors
    const safeRecentActivity = Array.isArray(userRecentActivities) ? userRecentActivities : [];

    // Format projects data to include proper dates for display
    const projectRows = projects.map((project) => ({
        id: project._id,
        name: project.name,
        status: project.status,
        createdAt: new Date(project.createdAt).toLocaleDateString(), // format date
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'projectName', headerName: 'Project Name', width: 200 },
        { field: 'status', headerName: 'Status', width: 170 },
        { field: 'createdAt', headerName: 'Created On', width: 150 },
        {
            field: 'view',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <button
                    onClick={() => handleViewClick(params.row.id)} // Navigate to the project detail page
                    className="btn simple-btn"
                >
                    View
                </button>
            ),
        },
    ];

    return (
        <section className={styles.dashboard}>
            {/* Stat Cards */}
            <div className="row mb-4">
                {[{ icon: 'fa-handshake', title: 'Total Projects', value: stats.totalProjects },
                  { icon: 'fa-buildings', title: 'Active Projects', value: stats.activeProjects },
                  { icon: 'fa-folders', title: 'Invoices', value: stats.invoices },
                  { icon: 'fa-box', title: 'Pending Approvals', value: stats.pendingApproval }]
                  .map((card, i) => (
                    <div key={i} className="col-md-3 col-sm-4 p-2">
                        <div className={styles.cardItem}>
                            <i className={`fa-regular ${card.icon}`}></i>
                            <h3>{card.title}</h3>
                            <p className="mb-0 fw-bold">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects + Activity */}
            <div className="row mt-2">
                <div className="col-md-9 d-flex flex-column">
                    <div className="flex-grow-1">
                        <div style={{ width: '100%', height: '500px', overflow: 'auto' }}>
                            <DataGrid
                                rows={projectRows}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableRowSelectionOnClick
                                style={{ borderRadius: '6px', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-3 d-flex flex-column">
                    <div className={`${styles.recentActivityCard} flex-grow-1`}>
                        <h3>Recent Activity</h3>
                        <div className="mt-3">
                            {safeRecentActivity.length > 0 ? (
                                safeRecentActivity.map((item, idx) => (
                                    <div key={idx}>
                                        <h5 className="">
                                            <i className="fa-regular fa-circle-check me-2"></i>
                                            {item.type}: {item?.status ?? item.status}
                                        </h5>
                                        <h5 className="mb-3">
                                            {convertDate(item.updatedAt)}
                                        </h5>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>No recent activity</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserDashboard;
