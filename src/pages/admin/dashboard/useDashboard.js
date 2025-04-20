// useDashboard.js
import { useEffect, useState } from 'react';
import apiService from '../../../utils/apiClient.js'
import { toast } from 'react-toastify';

const useDashboard = () => {

    const [loading, setLoading] = useState(false)

    const [topServicesData, setTopServicesData] = useState([]);

    const [monthlyServiceData, setMonthlyServiceData] = useState([]);

    const [stats, setStats] = useState({});

    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await apiService.get('/dashboard/admin');
                setTopServicesData(res.data.topServicesData);
                setMonthlyServiceData(res.data.monthlyServiceData);
                setStats(res.data.stats);
            } catch (err) {
                toast.error('Error loading dashboard data:', err);
            } finally{
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    const COLORS = [
        '#3B4A6B', // Tinted blue (matches #0088FE but darker)
        '#1A1E34', // Main brand color
        '#8E7433', // Muted gold to match theme (#FFBB28 adjusted)
        '#A45B3F', // Warm burnt orange (#FF8042 adjusted)
        '#6F6AA8', // Muted purple (#8884d8 adjusted)
    ];



    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };



    return {
        topServicesData,
        COLORS,
        monthlyServiceData,
        activeIndex,
        onPieEnter,
        stats,
        loading
    };
};

export default useDashboard;
