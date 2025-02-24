import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading components

// auth
const Login = lazy(() => import("../pages/auth/login/login.jsx"));
const Signup = lazy(() => import("../pages/auth/signup/signup.jsx"));

// dashboard
const AdminDashboard = lazy(() => import("../pages/admin/dashboard/dashboard.jsx"));
const StaffDashboard = lazy(() => import("../pages/staff/dashboard/dashboard.jsx"));
const UserDashboard = lazy(() => import("../pages/user/dashboard/dashboard.jsx"));

// projects
const AdminProjects = lazy(() => import("../pages/admin/projects/projects.jsx"));
const StaffProjects = lazy(() => import("../pages/staff/projects/projects.jsx"));
const UserProjects = lazy(() => import("../pages/user/projects/projects.jsx"));

// project Details
const ProjectDetails = lazy(() => import("../pages/sharedPages/projectDetails/projectDetails.jsx"));

// Creat Project
const CreateProject = lazy(() => import("../pages/user/createProject/createProject.jsx"));

// Assign Project
const AssignProject = lazy(() => import("../pages/admin/assignProject/assignProject.jsx"));

const NotFound = lazy(() => import("../components/notFound/NotFound.jsx"));
const Loading = lazy(() => import("../components/loading/loadin.jsx"));

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>

                    <Route path="/" element={<div>Home Page</div>} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/staff-dashboard" element={<StaffDashboard />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />

                    <Route path="/admin-projects" element={<AdminProjects />} />
                    <Route path="/staff-projects" element={<StaffProjects />} />
                    <Route path="/user-projects" element={<UserProjects />} />

                    <Route path="/project-details/:id" element={<ProjectDetails />} />

                    <Route path="/create-project" element={<CreateProject />} />

                    <Route path="/assign-project" element={<AssignProject />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;
