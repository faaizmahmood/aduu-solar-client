import { ToastContainer } from "react-toastify";
import "./styles/App.css";
import "nprogress/nprogress.css"; // Import NProgress styles
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setError, setLoading } from "./redux/userSlice";
import axios from "axios";
import Cookies from "js-cookie";
import ProtectedLayout from "./layout/protectedLayout";
import UnProtectedLayout from "./layout/unProtectedLayout";
import NProgress from "nprogress";
import { motion } from 'framer-motion'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const fetchUserProfile = useCallback(async () => {
    if (user) return;

    dispatch(setLoading(true));
    NProgress.start(); // Start NProgress

    try {
      const authToken = Cookies.get("authToken");
      if (!authToken) throw new Error("No auth token found");

      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      dispatch(setUser(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error fetching profile:", error);
      dispatch(setError(error.message));
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
        transition={{ duration: 1.3 }}>

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
