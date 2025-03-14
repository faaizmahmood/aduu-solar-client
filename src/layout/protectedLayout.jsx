/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import AppRoutes from "../routes/routes";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs"; // Import Breadcrumbs
import styles from "./layout.module.scss";

const ProtectedLayout = () => {
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
    const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setMobileView(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setCollapsed(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const authToken = Cookies.get("authToken");
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || storedUser;
    const userRole = currentUser?.role || "";

    const handleLogout = () => {
        Cookies.remove("authToken");
        localStorage.removeItem("user");
        location.reload();
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", height: "100vh" }} className={styles.appLayout}>
            {mobileView && (
                <button className={styles.mobileMenuButton} onClick={() => setCollapsed(!collapsed)}>
                    <i className="fas fa-bars"></i>
                </button>
            )}

            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                transitionDuration={500}
                backgroundColor="#1A1E34"
                className={`${styles.sidebar} ${mobileView && !collapsed ? styles.mobileSidebar : ""}`}
            >
                <Menu>
                    <MenuItem className={`${styles.menueCollapser}`} icon={<i className="fas fa-bars" style={{ color: "#fff" }}></i>} onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? "" : <h4 className="mt-2">Addu Solar</h4>}
                    </MenuItem>

                    {!collapsed && <div className={styles.menuSection}>Dashboard</div>}
                    <MenuItem icon={<i className="fas fa-home"></i>} className={`${styles.MenuItem} ${collapsed ? "mt-2" : ""}`} onClick={() => navigate("/")}>Home</MenuItem>

                    <hr className={`${styles.divider} ${collapsed ? `${styles.collapsedDivider}` : ""}`} />

                    {/* Projects Section */}
                    {!collapsed && <div className={styles.menuSection}>Projects</div>}
                    <MenuItem icon={<i className="fa-regular fa-folders"></i>} className={styles.MenuItem} onClick={() => navigate("/projects")}>Projects</MenuItem>

                    {userRole === "admin" && (
                        <MenuItem icon={<i className="fas fa-tasks"></i>} className={styles.MenuItem} onClick={() => navigate("/assign-project")}>Assign Project</MenuItem>
                    )}

                    {userRole === "admin" && (
                        <MenuItem icon={<i className="fa-regular fa-plus"></i>} className={styles.MenuItem} onClick={() => navigate("/add-service")}>Add Service</MenuItem>
                    )}

                    <hr className={`${styles.divider} ${collapsed ? `${styles.collapsedDivider}` : ""}`} />

                    {/* Invoices Section */}
                    {!collapsed && <div className={styles.menuSection}>Invoices</div>}
                    <MenuItem icon={<i className="fa-regular fa-file-invoice"></i>} className={styles.MenuItem} onClick={() => navigate("/invoices")}>View Invoices</MenuItem>
                    {userRole === "admin" && (
                        <MenuItem icon={<i className="fa-regular fa-file-circle-plus"></i>} className={styles.MenuItem} onClick={() => navigate("/create-invoice")}>Create Invoice</MenuItem>
                    )}

                    <hr className={`${styles.divider} ${collapsed ? `${styles.collapsedDivider}` : ""}`} />

                    {/* Account Section */}
                    {!collapsed && <div className={styles.menuSection}>Account</div>}
                    <MenuItem icon={<i className="fa-regular fa-user"></i>} className={styles.MenuItem} onClick={() => navigate("/profile")}>Profile</MenuItem>
                    <MenuItem icon={<i className="fa-regular fa-gear"></i>} className={styles.MenuItem} onClick={() => navigate("/settings")}>Settings</MenuItem>
                    {userRole === "admin" && (
                        <MenuItem icon={<i className="fa-regular fa-users"></i>} className={styles.MenuItem} onClick={() => navigate("/manage-team")}>Manage Team</MenuItem>
                    )}

                    <hr className={`${styles.divider} ${collapsed ? `${styles.collapsedDivider}` : ""}`} />

                    {/* Logout Section */}
                    <MenuItem icon={<i className="fa-regular fa-right-from-bracket"></i>} className={styles.MenuItem} onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Sidebar>

            {/* Main Content */}
            <main style={{ flexGrow: 1, padding: "20px", backgroundColor: '#F6F6F6', overflow: 'scroll', scrollbarWidth: 'none' }}>
                <Breadcrumbs />  {/* Add Breadcrumbs here */}
                <AppRoutes />
            </main>
        </div>
    );
};

export default ProtectedLayout;
