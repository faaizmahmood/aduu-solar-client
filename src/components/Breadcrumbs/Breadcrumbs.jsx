import { Link, useLocation } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { useSelector } from "react-redux";
import styles from "./breadcrumbs.module.scss";

// Custom breadcrumb routes
const routes = [
    { path: "/", breadcrumb: "Dashboard" },
    { path: "/profile", breadcrumb: "My Profile" },
    { path: "/projects", breadcrumb: "My Projects" },
    { path: "/services", breadcrumb: "Services" },
    { path: "/services/add-service", breadcrumb: "Add Service" },
    { path: "/services/edit-service/:serviceId", breadcrumb: "Edit Service" },
];

const customTitles = [
    { path: "/services/edit-service/", title: "Edit Service" },
    { path: "/project/order-service/", title: "Order Service" },
    { path: "/projects/assign-staff", title: "Assign Staff" },
    { path: "/projects/project-details", title: "Project Details" },
];

const Breadcrumbs = () => {
    const breadcrumbs = useBreadcrumbs(routes);
    const location = useLocation();
    const user = useSelector((state) => state.user?.user);

    const currentPath = location.pathname;

    // Determine dynamic page title
    let pageTitle = breadcrumbs[breadcrumbs.length - 1]?.breadcrumb || "Page";

    for (const item of customTitles) {
        if (currentPath.startsWith(item.path)) {
            pageTitle = item.title;
            break;
        }
    }

    const greeting =
        currentPath === "/" && user?.name
            ? `Hi ${user.name.split(" ")[0]}, welcome back 👋`
            : pageTitle;

    return (
        <>
            <nav className={`${styles.breadcrumbs} mb-3`}>
                <ul className="flex items-center space-x-2">
                    {breadcrumbs.map(({ match, breadcrumb }, index) => (
                        <li key={match.pathname} className="inline">
                            {index > 0 && <span className="mx-1">/</span>}
                            <Link
                                to={match.pathname}
                                className={`text-blue-500 hover:underline capitalize ${
                                    currentPath === match.pathname ? "font-bold" : ""
                                }`}
                            >
                                {breadcrumb}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <h3 className="text-xl font-semibold">{greeting}</h3>
        </>
    );
};

export default Breadcrumbs;
