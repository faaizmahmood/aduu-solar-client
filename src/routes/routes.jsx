/* eslint-disable react/prop-types */
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/auth/login/login.jsx"));
const Signup = lazy(() => import("../pages/auth/signup/signup.jsx"));
const Dashboard = lazy(() => import("../pages/sharedPages/dashboard/dashboard.jsx"));
const Projects = lazy(() => import("../pages/sharedPages/projects/projects.jsx"));
const ProjectDetails = lazy(() => import("../pages/sharedPages/projectDetails/projectDetails.jsx"));
const OrderService = lazy(() => import("../pages/user/orderService2/orderService.jsx"));
const AssignProject = lazy(() => import("../pages/admin/assignStaff/assignStaff.jsx"));
const ManageTeam = lazy(() => import("../pages/admin/manageTeam/manageTeam.jsx"));
const AddService = lazy(() => import("../pages/admin/addService/addService.jsx"));
const Services = lazy(() => import("../pages/admin/services/services.jsx"));

// Regular components (non-lazy)
import NotFound from "../components/notFound/NotFound.jsx";
import Loading from "../components/loading/loading.jsx";
import CompanyAuth from "../pages/auth/companyAuth/companyAuth.jsx";
import Company from "../pages/user/company/company.jsx";
import Invoices from "../pages/sharedPages/invoices/invoices.jsx";
import Messaging from "../components/messaging/messaging.jsx";
import ProjectOverview from "../components/projectOverview/projectOverview.jsx";


// ProtectedRoute HOC
const ProtectedRoute = ({ element, allowedRoles }) => {
    const authToken = Cookies.get("authToken");
    const { user, loading } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || storedUser;

    if (!authToken) return <Navigate to="/login" replace />;
    if (loading) return <Loading />;
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }

    return element;
};

const AppRoutes = () => {
    const isAuthenticated = Boolean(Cookies.get("authToken"));

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* ---------------------- PUBLIC ROUTES ---------------------- */}
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/company-register" element={<CompanyAuth />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <>
                        {/* ------------------ REDIRECTS FOR AUTH USERS ------------------ */}
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/signup" element={<Navigate to="/" replace />} />
                        <Route path="/company-register" element={<Navigate to="/" replace />} />

                        <Route path="/project" element={<Navigate to="/projects" replace />} />
                        <Route path="/order-service" element={<Navigate to="/projects" replace />} />
                        <Route path="/project/order-service" element={<Navigate to="/projects" replace />} />

                        <Route path="/projects/project-details" element={<Navigate to="/projects" replace />} />
                        <Route path="/projects/assign-staff" element={<Navigate to="/projects" replace />} />
                        <Route path="/services/edit-service" element={<Navigate to="/services" replace />} />

                        {/* ------------------ SHARED ROUTES ------------------ */}
                        <Route path="/" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["admin", "staff", "client"]} />} />
                        <Route path="/projects" element={<ProtectedRoute element={<Projects />} allowedRoles={["admin", "staff", "client"]} />} />
                        <Route
                            path="/projects/project-details/:projectID"
                            element={
                                <ProtectedRoute
                                    element={<ProjectDetails />}
                                    allowedRoles={["admin", "staff", "client"]}
                                />
                            }
                        >
                            <Route path="overview" element={<ProjectOverview />} />
                            <Route path="messaging" element={<Messaging />} />
                            <Route index element={<Navigate to="overview" replace />} />
                        </Route>
                        <Route path="/invoices" element={<ProtectedRoute element={<Invoices />} allowedRoles={["admin", "client"]} />} />
                        <Route path="/settings" element={<ProtectedRoute element={"Coming Soon"} allowedRoles={["admin", "staff", "client"]} />} />
                        <Route path="/profile" element={<ProtectedRoute element={"Coming Soon"} allowedRoles={["admin", "staff", "client"]} />} />

                        {/* ------------------ CLIENT ROUTES ------------------ */}
                        <Route path="/project/order-service/:projectID" element={<ProtectedRoute element={<OrderService />} allowedRoles={["client"]} />} />
                        <Route path="/company" element={<ProtectedRoute element={<Company />} allowedRoles={["client"]} />} />

                        {/* ------------------ ADMIN ROUTES ------------------ */}
                        <Route path="/projects/assign-staff/:projectID" element={<ProtectedRoute element={<AssignProject />} allowedRoles={["admin"]} />} />
                        <Route path="/services" element={<ProtectedRoute element={<Services />} allowedRoles={["admin"]} />} />
                        <Route path="/services/add-service" element={<ProtectedRoute element={<AddService />} allowedRoles={["admin"]} />} />
                        <Route path="/services/edit-service/:serviceId" element={<ProtectedRoute element={<AddService />} allowedRoles={["admin"]} />} />
                        <Route path="/manage-team" element={<ProtectedRoute element={<ManageTeam />} allowedRoles={["admin"]} />} />

                        {/* ------------------ FALLBACK ROUTE ------------------ */}
                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
