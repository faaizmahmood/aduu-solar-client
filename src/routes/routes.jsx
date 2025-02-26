/* eslint-disable react/prop-types */
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

// Lazy-loaded components
const Login = lazy(() => import("../pages/auth/login/login.jsx"));
const Signup = lazy(() => import("../pages/auth/signup/signup.jsx"));
const Dashboard = lazy(() => import("../pages/sharedPages/dashboard/dashboard.jsx"));
const AdminProjects = lazy(() => import("../pages/admin/projects/projects.jsx"));
const StaffProjects = lazy(() => import("../pages/staff/projects/projects.jsx"));
const UserProjects = lazy(() => import("../pages/user/projects/projects.jsx"));
const ProjectDetails = lazy(() => import("../pages/sharedPages/projectDetails/projectDetails.jsx"));
const CreateProject = lazy(() => import("../pages/user/createProject/createProject.jsx"));
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

                        {/* Dashboard Redirect Based on Role */}
                        <Route path="/" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["admin", "staff", "client"]} />} />

                        {/* Role-Based Routes */}
                        <Route path="/admin-projects" element={<ProtectedRoute element={<AdminProjects />} allowedRoles={["admin"]} />} />
                        <Route path="/staff-projects" element={<ProtectedRoute element={<StaffProjects />} allowedRoles={["staff"]} />} />
                        <Route path="/user-projects" element={<ProtectedRoute element={<UserProjects />} allowedRoles={["client"]} />} />

                        <Route path="/project-details/:id" element={<ProtectedRoute element={<ProjectDetails />} allowedRoles={["admin", "staff", "client"]} />} />

                        <Route path="/create-project" element={<ProtectedRoute element={<CreateProject />} allowedRoles={["client"]} />} />
                        <Route path="/assign-project" element={<ProtectedRoute element={<AssignProject />} allowedRoles={["admin"]} />} />

                        {/* Catch-All Route for Authenticated Users */}
                        <Route path="*" element={<NotFound />} />
                    </>
                )}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
