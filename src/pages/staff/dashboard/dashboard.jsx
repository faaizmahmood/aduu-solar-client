import { useEffect, useState } from 'react';
import styles from './dashboard.module.scss';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment'; // Optional: for formatting dates
import apiService from '../../../utils/apiClient';

const columns = [
    { field: 'name', headerName: 'Project', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
        field: 'assignedAt',
        headerName: 'Assigned On',
        flex: 1,
        valueFormatter: (params) =>
            params?.value ? moment(params.value).format('YYYY-MM-DD') : 'N/A',
    }
    ,
    {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        renderCell: () => (
            <button className="btn btn-sm simple-btn">View</button>
        ),
    },
];

const StaffDashboard = () => {
    const [stats, setStats] = useState({
        allTimeProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
    });
    const [assignedProjects, setAssignedProjects] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiService.get('/dashboard/staff');
                const { stats, assignedProjects, recentActivities } = res.data;

                setStats(stats);
                setAssignedProjects(assignedProjects);
                setRecentActivities(recentActivities);
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className={styles.dashboard}>
            {/* Stat Cards */}
            <div className="row mb-4">
                {[
                    { icon: 'fa-screwdriver-wrench', title: 'All Time Projects', value: stats.allTimeProjects },
                    { icon: 'fa-clock', title: 'Active Projects', value: stats.activeProjects },
                    { icon: 'fa-check-double', title: 'Completed Projects', value: stats.completedProjects },
                ].map((card, i) => (
                    <div key={i} className="col-md-4 col-sm-6 p-2">
                        <div className={styles.cardItem}>
                            <i className={`fa-regular ${card.icon}`}></i>
                            <h3>{card.title}</h3>
                            <p className="mb-0 fw-bold">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-2">
                {/* Assigned Projects Table */}
                <div className="col-md-8 d-flex flex-column">
                    <div className="flex-grow-1 mb-4">
                        <div style={{ width: '100%', height: '400px', overflow: 'auto' }}>
                            <DataGrid
                                rows={assignedProjects}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableRowSelectionOnClick
                                getRowId={(row) => row.id}
                                style={{ borderRadius: '6px', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-md-4 d-flex flex-column">
                    <div className={`${styles.recentActivityCard} flex-grow-1`}>
                        <h4 className="mb-3">Recent Activity</h4>
                        {recentActivities.length === 0 ? (
                            <h5>No recent updates yet</h5>
                        ) : (
                            <div className="">
                                {recentActivities.map((activity, index) => (
                                    <>
                                        <div key={index} className="mt-2 d-flex justify-content-between">
                                            <h5>
                                                <i className="fa-regular fa-circle-check me-2"></i>
                                                <strong>{activity.type}:</strong> {activity.name}
                                                <br />
                                                <small>Status: {activity.status}</small>
                                            </h5>
                                            <small>{moment(activity.updatedAt).fromNow()}</small>
                                        </div>
                                        <hr />
                                    </>
                                ))}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StaffDashboard;
