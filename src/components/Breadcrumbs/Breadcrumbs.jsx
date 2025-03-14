import { Link, useLocation } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import styles from "./breadcrumbs.module.scss";

// Define custom breadcrumbs for specific paths
const routes = [
    { path: "/", breadcrumb: "Home" },
    { path: "/profile", breadcrumb: "My Profile" },
    { path: "/projects", breadcrumb: "My Projects" },
    { path: "/projects/order-service/:ProjectID", breadcrumb: ({ match }) => `Order #${match.params.orderId}` },
];

const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs(routes);
    const location = useLocation();

    return (
        <nav className={`${styles.breadcrumbs} mb-3`}>
            <ul className="">
                {breadcrumbs.map(({ match, breadcrumb }, index) => (
                    <li key={match.pathname} className="">
                        {index > 0 && <span className="mx-2">/</span>}
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
    );
};

export default Breadcrumbs;
