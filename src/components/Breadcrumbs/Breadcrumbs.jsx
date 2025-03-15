import { Link, useLocation } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import styles from "./breadcrumbs.module.scss";
import { useSelector } from "react-redux";

// Define custom breadcrumbs for specific paths
const routes = [
    { path: "/", breadcrumb: "Dashboard" },
    { path: "/profile", breadcrumb: "My Profile" },
    { path: "/projects", breadcrumb: "My Projects" },
    { path: "/services", breadcrumb: "Services" },
    { path: "/services/add-service", breadcrumb: "Add Service" }, // Nested under "Services"
    { path: "/project/order-service/:ProjectID", breadcrumb: "Order Service" },
];

const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs(routes);
    const location = useLocation();
    const user = useSelector((state) => state.user?.user);

    const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.breadcrumb || "Page";

    return (
        <>
            <nav className={`${styles.breadcrumbs} mb-3`}>
                <ul className="flex items-center space-x-2">
                    {breadcrumbs.map(({ match, breadcrumb }, index) => (
                        <li key={match.pathname} className="inline">
                            {index > 0 && <span className="mx-1">/</span>}
                            <Link
                                to={match.pathname}
                                className={`text-blue-500 hover:underline capitalize ${location.pathname === match.pathname ? "font-bold" : ""
                                    }`}
                            >
                                {breadcrumb}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <h3>
                {location.pathname === "/" && user?.name
                    ? `Welcome, ${user.name}`
                    : pageTitle}
            </h3>
        </>
    );
};

export default Breadcrumbs;
