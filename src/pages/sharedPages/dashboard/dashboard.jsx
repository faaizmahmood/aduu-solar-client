import { useSelector } from "react-redux";
import AdminDashboard from "../../admin/dashboard/dashboard";
import StaffDashboard from "../../staff/dashboard/dashboard";
import UserDashboard from "../../user/dashboard/dashboard";
import styles from "./dashboard.module.scss";

const Dashboard = () => {
    // Get user details from Redux store or localStorage
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || storedUser;
    const userRole = currentUser?.role || "";

    return (
        <section className={styles.dashboard}>
            {userRole === "admin" && <AdminDashboard />}
            {userRole === "staff" && <StaffDashboard />}
            {userRole === "client" && <UserDashboard />}
        </section>
    );
};

export default Dashboard;
