import { useEffect, useState } from "react";
import apiService from '../../../utils/apiClient.js';

const useDashboard = () => {

    const [stats, setStats] = useState(null);

    const [projects, setProjects] = useState([])

    const [userRecentActivities, setUserRecentActivities] = useState([])

    const [userType, setUserType] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await apiService.get('/dashboard/client');
                const { stats, userType, projects, recentActivities } = res.data;
                setStats(stats);
                setProjects(projects)
                setUserRecentActivities(recentActivities)
                setUserType(userType || null); // Optional, in case you want to use this
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    const convertDate = (date) => {

        const formattedDate = new Date(date).toLocaleString('en-US', {
            weekday: 'short', // e.g. "Mon"
            year: 'numeric', // e.g. "2025"
            month: 'short', // e.g. "Apr"
            day: 'numeric', // e.g. "7"
            hour: 'numeric', // e.g. "12"
            minute: 'numeric', // e.g. "30"
            second: 'numeric', // e.g. "00"
        });


        return formattedDate

    }


    return {
        stats,
        userType,
        loading,
        projects,
        userRecentActivities,
        convertDate
    };
};

export default useDashboard;
