/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import AppRoutes from "../routes/routes";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import styles from "./layout.module.scss";
import Logo from '../../public/images/AduuSolar_Logo.png';

const ProtectedLayout = () => {
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
    const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            setMobileView(isMobile);
            if (!isMobile) setCollapsed(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const authToken = Cookies.get("authToken");
    const reduxuser = useSelector((state) => state.user.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = reduxuser || storedUser;
    const userRole = currentUser?.role || "";
    const isCompanyOwner = currentUser?.companyRole === "owner" && Boolean(currentUser?.companyId);

    const handleLogout = () => {
        Cookies.remove("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Force full reload and redirect
    };

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        {
            section: "Dashboard",
            items: [
                { label: "Home", icon: "fa-home", path: "/" },
            ]
        },
        {
            section: "Projects",
            items: [
                { label: "Projects", icon: "fa-folders", path: "/projects" },
            ]
        },
        {
            section: "Company",
            show: userRole === "client" && isCompanyOwner,
            items: [
                { label: "Company", icon: "fa-buildings", path: "/company" },
            ]
        },
        {
            section: "Services",
            show: userRole === "admin",
            items: [
                { label: "Services", icon: "fa-user-gear", path: "/services" },
            ]
        },
        {
            section: "Invoices",
            show: userRole !== "staff",
            items: [
                { label: "View Invoices", icon: "fa-file-invoice", path: "/invoices" },
            ]
        },
        {
            section: "Account",
            items: [
                { label: "Profile", icon: "fa-user", path: "/profile" },
                { label: "Settings", icon: "fa-gear", path: "/settings" },
                ...(userRole === "admin" ? [
                    { label: "Manage Team", icon: "fa-users", path: "/manage-team" }
                ] : [])
            ]
        }
    ];

    return (
        <div className={styles.appLayout} style={{ display: "flex", height: "100vh" }}>
            {mobileView && (
                <button className={styles.mobileMenuButton} onClick={() => setCollapsed(!collapsed)}>
                    <i className="fas fa-bars"></i>
                </button>
            )}  

            <Sidebar
                collapsed={collapsed}
                transitionDuration={500}
                backgroundColor="#1A1E34"
                className={`${styles.sidebar} ${mobileView && !collapsed ? styles.mobileSidebar : ""}`}
            >
                <Menu>
                    <MenuItem
                        className={styles.menueCollapser}
                        icon={<i className="fas fa-bars" style={{ color: "#fff" }} />}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {!collapsed && <img alt="Logo" className={styles.logo} src={Logo} />}
                    </MenuItem>

                    {menuItems.map((section, idx) => (
                        section.show !== false && (
                            <div key={idx}>
                                {!collapsed && <div className={styles.menuSection}>{section.section}</div>}
                                {section.items.map(({ label, icon, path }) => (
                                    <MenuItem
                                        key={path}
                                        icon={
                                            <i className={`fa-regular ${icon}`} style={{ fontWeight: isActive(path) ? "bold" : "normal", fontSize: isActive(path) ? "16px" : "" }} />
                                        }
                                        className={`${styles.MenuItem} ${isActive(path) ? styles.activeMenuItem : ""}`}
                                        onClick={() => navigate(path)}
                                    >
                                        {label}
                                    </MenuItem>
                                ))}
                                <hr className={`${styles.divider} ${collapsed ? styles.collapsedDivider : ""}`} />
                            </div>
                        )
                    ))}

                    <MenuItem
                        icon={<i className="fa-regular fa-right-from-bracket" />}
                        className={styles.MenuItem}
                        onClick={handleLogout}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Sidebar>

            <main
                style={{
                    flexGrow: 1,
                    padding: "20px",
                    backgroundColor: '#F6F6F6',
                    overflow: 'auto',
                    scrollbarWidth: 'none'
                }}
            >
                <Breadcrumbs />
                <AppRoutes />
            </main>
        </div>
    );
};

export default ProtectedLayout;
