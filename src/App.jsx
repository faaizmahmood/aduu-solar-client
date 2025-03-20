import { ToastContainer } from "react-toastify";
import "./styles/App.css";
import "nprogress/nprogress.css"; // Import NProgress styles
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "./redux/userSlice";
import Cookies from "js-cookie";
import ProtectedLayout from "./layout/protectedLayout";
import UnProtectedLayout from "./layout/unProtectedLayout";
import NProgress from "nprogress";
import { motion } from "framer-motion";
import apiService from "./utils/apiClient.js"; // Import centralized API service


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const fetchUserProfile = useCallback(async () => {
    if (user) return;

    dispatch(setLoading(true));
    NProgress.start(); // Start NProgress

    try {
      const response = await apiService.get("/user/profile"); // Using centralized API service
      dispatch(setUser(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error fetching profile:", error);
      dispatch(setError(error.response?.data?.message || "Failed to fetch profile"));
    } finally {
      dispatch(setLoading(false));
      NProgress.done(); // Stop NProgress
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const authToken = Cookies.get("authToken");
  const isAuthenticated = Boolean(authToken);

  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.3 }}
      >
        {isAuthenticated ? <ProtectedLayout /> : <UnProtectedLayout />}
      </motion.main>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
