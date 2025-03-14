/* eslint-disable react/prop-types */
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import ManageTeam from "../pages/admin/manageTeam/manageTeam.jsx";

// Lazy-loaded components
const Login = lazy(() => import("../pages/auth/login/login.jsx"));
const Signup = lazy(() => import("../pages/auth/signup/signup.jsx"));
const Dashboard = lazy(() => import("../pages/sharedPages/dashboard/dashboard.jsx"));
// const AdminProjects = lazy(() => import("../pages/admin/projects/projects.jsx"));
// const StaffProjects = lazy(() => import("../pages/staff/projects/projects.jsx"));
// const UserProjects = lazy(() => import("../pages/user/projects/projects.jsx"));
const Projects = lazy(() => import("../pages/sharedPages/projects/projects.jsx"));
const ProjectDetails = lazy(() => import("../pages/sharedPages/projectDetails/projectDetails.jsx"));
const OrderService = lazy(() => import("../pages/user/orderService/orderService.jsx"));
const AssignProject = lazy(() => import("../pages/admin/assignProject/assignProject.jsx"));
const NotFound = lazy(() => import("../components/notFound/NotFound.jsx"));
const Loading = lazy(() => import("../components/loading/loading.jsx"));

const ProtectedRoute = ({ element, allowedRoles }) => {
    const authToken = Cookies.get("authToken");
    const { user, loading } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = user || storedUser;

    if (!authToken) return <Navigate to="/login" replace />;
    if (loading) return <Loading />;
    if (!currentUser || !allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;

    return element;
};

const AppRoutes = () => {
    const authToken = Cookies.get("authToken");
    const isAuthenticated = Boolean(authToken);

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public Routes */}
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <>
                        {/* Redirect Login/Signup if Authenticated */}
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/signup" element={<Navigate to="/" replace />} />

                        {/* Redirect Paths*/}
                        <Route path="/project/order-service" element={<Navigate to="/projects" replace />} />
                        <Route path="/order-service" element={<Navigate to="/projects" replace />} />
                        <Route path="/project" element={<Navigate to="/projects" replace />} />

                        {/* Dashboard Redirect Based on Role */}
                        <Route path="/" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["admin", "staff", "client"]} />} />

                        {/* Role-Based Routes */}
                        <Route path="/projects" element={<ProtectedRoute element={<Projects />} allowedRoles={["client", "staff", "admin"]} />} />

                        <Route path="/project-details/:projectID" element={<ProtectedRoute element={<ProjectDetails />} allowedRoles={["admin", "staff", "client"]} />} />

                        <Route path="/project/order-service/:projectID" element={<ProtectedRoute element={<OrderService />} allowedRoles={["client"]} />} />

                        <Route path="/assign-project" element={<ProtectedRoute element={<AssignProject />} allowedRoles={["admin"]} />} />

                        <Route path="/add-service" element={<ProtectedRoute element={"Add Service"} allowedRoles={["admin"]} />} />

                        <Route path="/manage-team" element={<ProtectedRoute element={<ManageTeam />} allowedRoles={["admin"]} />} />

                        {/* Catch-All Route for Authenticated Users */}
                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
